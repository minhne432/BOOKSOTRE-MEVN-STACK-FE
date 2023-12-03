<template>
  <Sidebar />
  <div class="home">
    <h1>Danh sách đơn hàng</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Fullname</th>
          <th>address</th>
          <th>Order Date</th>
          <th>Status</th>
          <th>Total Money</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user_id }}</td>
          <td>{{ order.fullname }}</td>
          <td>{{ order.address }}</td>
          <td>{{ formatOrderDate(order.order_date) }}</td>
          <td>
            <select v-model="order.status" @change="updateStatus(order)">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td>{{ order.total_money }}</td>
          <td>
            <button class="custom-button" @click="showOrderDetails(order.id)">
              Xem chi tiết sản phẩm
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal hiển thị thông tin chi tiết đơn hàng -->

    <div v-if="showDetailsModal" class="order-details-modal">
      <table>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <!-- Các cột thông tin khác về sản phẩm -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in orderDetails" :key="index">
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.number_of_products }}</td>
            <!-- Các ô thông tin khác về sản phẩm -->
          </tr>
        </tbody>
      </table>
      <button @click="closeDetailsModal">Trở lại</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
const orders = ref([])

onMounted(async () => {
  await fetchOrders()
})

async function fetchOrders() {
  try {
    const response = await fetch('http://localhost:3000/api/orders/admin/getAllOrders')
    orders.value = await response.json()
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

function formatOrderDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString()
}

async function updateStatus(order) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/orders/admin/getAllOrders/${order.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: order.status })
      }
    )

    if (response.ok) {
      console.log(`Order ${order.id} updated successfully!`)
      // Cập nhật trạng thái ngay trong danh sách orders
      const updatedOrderIndex = orders.value.findIndex((o) => o.id === order.id)
      if (updatedOrderIndex !== -1) {
        orders.value[updatedOrderIndex].status = order.status
      }
    } else {
      console.error('Failed to update order status')
    }
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
}

const showDetailsModal = ref(false)
const orderDetails = ref([])

const showOrderDetails = async (orderId) => {
  try {
    console.log(orderId)
    const response = await fetch(`http://localhost:3000/api/orders/getOrdersDetails/${orderId}}`)
    if (response.ok) {
      orderDetails.value = await response.json()
      console.log(orderDetails.value)
      showDetailsModal.value = true
    } else {
      console.error('Error fetching order details:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching order details:', error)
  }
}
</script>


<style scoped>
/* CSS cho trang quản lý đơn hàng */
/* Thiết lập font cho header và tiêu đề */
h1 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif; /* Thay đổi font chữ cho header */
  color: #333; /* Đổi màu chữ của header */
}

/* Định dạng header của bảng */
th {
  background-color: #f2f2f2;
  padding: 12px; /* Tăng khoảng cách lề của header */
  text-align: center; /* Căn giữa nội dung trong header */
}

/* Định dạng dòng trong bảng */
td {
  border-bottom: 1px solid #ddd;
  padding: 12px; /* Tăng khoảng cách lề của dòng */
  text-align: center; /* Căn giữa nội dung trong dòng */
}

/* Định dạng màu nền cho các dòng chẵn */
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Định dạng cột Status */
td:nth-child(6) select {
  /* Thay đổi màu nền hoặc màu chữ để làm nổi bật */
  background-color: #cbe5f9;
  color: #333;
  font-weight: bold; /* Làm đậm chữ */
  padding: 8px;
}

/* Tạo đường viền cho bảng */
table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ddd;
}

/* Tạo đường viền cho cột */
th,
td {
  border: 1px solid #ddd;
}

.order-details-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  /* Các thuộc tính khác để tạo giao diện modal */
}

.order-details-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-details-modal table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-details-modal th,
.order-details-modal td {
  border: 1px solid #ddd;
  padding: 8px;
}

.order-details-modal th {
  background-color: #f2f2f2;
}

.order-details-modal button {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.order-details-modal button:hover {
  background-color: #c0392b;
}

.order-details-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px; /* Đặt max-width theo ý muốn của bạn */
  width: 90%; /* Đặt width để có độ rộng lớn hơn khi cần thiết */
  margin: 0 auto; /* Để căn giữa nếu width nhỏ hơn max-width */
}

/* Thiết lập các thuộc tính cơ bản cho nút */
.custom-button {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3498db; /* Màu nền của nút */
  color: white; /* Màu chữ của nút */
}

/* Hiệu ứng khi di chuột vào nút */
.custom-button:hover {
  background-color: #2980b9; /* Màu nền thay đổi khi di chuột vào */
}
</style>