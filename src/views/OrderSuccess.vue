<template>
  <Sidebar />
  <div class="order-details">
    <h1>Chi tiết đơn hàng</h1>
    <div class="order-info">
      <p><strong>ID đơn hàng:</strong> {{ parsedData.order.id }}</p>
      <p><strong>Thời gian đặt hàng:</strong> {{ formatOrderDate(parsedData.order.order_date) }}</p>
      <p><strong>Trạng thái:</strong> {{ parsedData.order.status }}</p>
      <p><strong>Người nhận:</strong> {{ parsedData.items.fullname }}</p>
      <p><strong>Số điện thoại:</strong> {{ parsedData.items.phone_number }}</p>
    </div>
    <div class="product-details">
      <h2>Chi tiết sản phẩm</h2>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in parsedData.items.items" :key="index">
            <td>{{ item.product_name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }}</td>
          </tr>
          <!-- Thêm các dòng sản phẩm khác tương tự -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const orderData = route.query.orderData
const parsedData = ref({})

const formatOrderDate = (date) => {
  return new Date(date).toLocaleString()
}
// Kiểm tra và xử lý dữ liệu
if (orderData) {
  try {
    parsedData.value = JSON.parse(orderData)
    console.log(parsedData.value) // Sử dụng dữ liệu đã được parse
  } catch (error) {
    console.error('Error parsing orderData:', error)
  }
}
</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.order-details {
  width: 80%;
  margin: 20px auto;
  border: 1px solid #ccc;
  padding: 20px;
}

.order-info p {
  margin: 5px 0;
}

.product-details table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-details th,
.product-details td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.product-details th {
  background-color: #f2f2f2;
}
</style>