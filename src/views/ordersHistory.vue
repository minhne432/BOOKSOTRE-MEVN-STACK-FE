<template>
  <SideBar />
  <div class="order-history">
    <h1>Lịch sử đơn hàng</h1>
    <table class="order-table">
      <thead>
        <tr>
          <th>ID đơn hàng</th>
          <th>Ngày đặt hàng</th>
          <th>Trạng thái</th>
          <th>Người nhận</th>
          <th>Số điện thoại</th>
          <th>Chi tiết sản phẩm</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ formatOrderDate(order.order_date) }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.fullname }}</td>
          <td>{{ order.phone_number }}</td>
          <td>
            <button @click="showOrderDetails(order.id)">Xem chi tiết sản phẩm</button>
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
import SideBar from '@/components/SideBar.vue'
const orders = ref([])
const userId = ref(localStorage.getItem('id')) // Thay thế userId bằng dữ liệu thực tế
const formatOrderDate = (date) => {
  return new Date(date).toLocaleString()
}

const fetchOrders = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/orders/getOrders/${userId.value}`)
    if (response.ok) {
      orders.value = await response.json()
    } else {
      console.error('Error fetching orders:', response.statusText)
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
}
onMounted(fetchOrders)

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

<style>
/* CSS để căn giữa và tùy chỉnh giao diện bảng */
.order-history {
  text-align: center;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.order-table th {
  background-color: #f2f2f2;
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
</style>
