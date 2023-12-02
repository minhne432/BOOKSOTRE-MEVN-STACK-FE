<template>
  <SideBar />
  <div class="home">
    <div class="cart-container">
      <h1>Giỏ hàng của bạn</h1>
      <button @click="showPurchaseModal = true">Mua hàng</button>
      <ul class="cart-items">
        <li v-for="(product, index) in cartItems" :key="index" class="cart-item">
          <!-- Hiển thị thông tin của mỗi sản phẩm -->
          <div class="product-info">
            <img :src="product.thumbnail" class="product-image" />
            <div class="product-details">
              <p class="product-name">{{ product.name }}</p>
              <p class="product-price">Giá: {{ product.price }}</p>
              <p class="product-quantity">số lượng: {{ product.quantity }}</p>

              <!-- Các thông tin khác về sản phẩm -->
            </div>
          </div>
          <button @click="deleteItem(product.item_id)" class="red-button">Remove</button>
        </li>
      </ul>
    </div>
  </div>

  <!-- Modal hiển thị thông tin mua hàng -->
  <div v-if="showPurchaseModal" class="purchase-modal">
    <div class="modal-content">
      <!-- Form thông tin mua hàng -->
      <div class="form-section">
        <form @submit.prevent="confirmPurchase">
          <h2>Nhập thông tin mua hàng</h2>
          <label for="name">Tên:</label>
          <input type="text" id="name" v-model="fullname" required />

          <label for="phone">Số điện thoại:</label>
          <input type="text" id="phone" v-model="phone_number" required />

          <label for="address">Địa chỉ:</label>
          <input type="text" id="address" v-model="address" required />
          <div class="payment-method">
            <p>Phương thức thanh toán</p>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                v-model="selectedPaymentMethod"
                value="cash"
              />
              Cash On Delivery
            </label>

            <label>
              <input
                type="radio"
                name="paymentMethod"
                v-model="selectedPaymentMethod"
                value="bankTransfer"
              />
              Bank Transfer
            </label>
          </div>
          <!-- Nút xác nhận mua hàng -->
          <button type="submit">Xác nhận mua hàng</button>
          <button @click="closePurchaseModal" class="red-button-1">Đóng</button>
        </form>
      </div>

      <div class="product-details-section">
        <h3>Chi tiết sản phẩm</h3>
        <table>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in cartItems" :key="index">
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.price * product.quantity }}</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Tổng số tiền cần thanh toán: {{ calculateTotal() }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue'
import { ref, onMounted } from 'vue'
import ordersService from '@/services/order.service.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const fullname = ref(localStorage.getItem('fullname'))
const phone_number = ref(localStorage.getItem('phone_number'))
const address = ref(localStorage.getItem('address'))
const user_id = ref(localStorage.getItem('id'))
// Khai báo ref để lưu trữ thông tin giỏ hàng
const cartItems = ref([])
// Khai báo data cho form mua hàng
const showPurchaseModal = ref(false)

const calculateTotal = () => {
  let total = 0

  // Duyệt qua từng sản phẩm trong giỏ hàng và tính tổng số tiền
  for (const product of cartItems.value) {
    total += product.price * product.quantity
  }

  return total
}

// Phương thức xử lý khi người dùng xác nhận mua hàng
const confirmPurchase = async () => {
  try {
    const orderData = {
      user_id: user_id.value,
      fullname: fullname.value,
      phone_number: phone_number.value,
      address: address.value,
      items: cartItems.value.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
    console.log(orderData)
    // Gửi dữ liệu đặt hàng đến API
    const response = await ordersService.createOrder(orderData)

    if (response.ok) {
      // Xử lý khi đặt hàng thành công

      // Đóng modal sau khi xác nhận mua hàng thành công
      closePurchaseModal()
      await router.push({
        name: 'order.Details',
        query: { orderData: JSON.stringify({ order: response.data.order, items: orderData }) } // Truyền dữ liệu orderData qua query params
      })
    } else {
      console.error('Error placing order:', response.message)
    }
  } catch (error) {
    console.error('Error placing order:', error)
  }
  closePurchaseModal()
}

// Phương thức để đóng modal
const closePurchaseModal = () => {
  showPurchaseModal.value = false
}

// Logic để lấy dữ liệu giỏ hàng từ service khi component được tạo
onMounted(async () => {
  try {
    const user_id = localStorage.getItem('id')
    const response = await ordersService.getCartByUserId(user_id)

    if (response.ok) {
      cartItems.value = response.data
      console.log(cartItems.value)
    } else {
      console.error('Error fetching cart details:', response.message)
    }
  } catch (error) {
    console.error('Error fetching cart details:', error)
  }
})

const deleteItem = async (item_id) => {
  try {
    const response = await ordersService.deleteCartItemById(item_id)
    if (response.ok) {
      // Xóa sản phẩm thành công từ giỏ hàng API

      // Cập nhật lại danh sách sản phẩm hiển thị trên giao diện
      cartItems.value = cartItems.value.filter((item) => item.item_id !== item_id)
    } else {
      console.error('Error deleting item:', response.message)
    }
  } catch (error) {
    console.error('Error deleting item:', error)
  }
}
</script>

<style >
/* CSS cho trang giỏ hàng */
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.cart-items {
  list-style-type: none;
  padding: 0;
}

.cart-item {
  border-bottom: 1px solid #ccc;
  padding: 15px 0;
  display: flex;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 100px;
  height: auto;
  margin-right: 20px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.product-price {
  color: #555;
  margin: 0;
}

button {
  padding: 8px 16px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}
.red-button {
  padding: 10px 20px;
  background-color: #e74c3c; /* Màu đỏ */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 390px;
}
/* CSS cho nút Remove màu đỏ */
.red-button-1 {
  padding: 10px 20px;
  background-color: #e74c3c; /* Màu đỏ */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 5px;
}

.red-button:hover {
  background-color: #c0392b; /* Màu đỏ nhạt khi hover */
}

/* CSS cho modal mua hàng */
.purchase-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  width: 100%;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type='text'] {
  width: calc(100% - 16px);
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
}

button[type='submit'],
button[type='button'] {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover,
button[type='button']:hover {
  background-color: #2980b9;
}

/* CSS cho modal */
/* CSS cho form mua hàng */
.purchase-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  width: 100%;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type='text'] {
  width: calc(100% - 16px);
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
}

button[type='submit'],
button[type='button'] {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover,
button[type='button']:hover {
  background-color: #2980b9;
}

.modal-content {
  /* ... (các thuộc tính CSS khác) ... */
  display: flex;
  flex-direction: row; /* Sắp xếp theo hàng ngang */
  justify-content: space-between; /* Cách đều các phần tử */
  align-items: flex-start; /* Canh chỉnh theo chiều dọc */
}

.form-section {
  flex: 1; /* Chiếm phần bên trái của form */
}

.product-details-section {
  flex: 1; /* Chiếm phần bên phải của form */
  margin-left: 20px; /* Khoảng cách với phần bên trái */
}
.modal-content {
  /* Các thuộc tính CSS khác */
  width: 80%; /* Đặt kích thước cần thiết, ví dụ 80% chiều rộng */
  /* ... */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: center;
  padding: 8px; /* Thêm padding để tạo khoảng cách giữa nội dung và viền */
  border: 1px solid #ddd; /* Định dạng đường viền cho ô */
}

th {
  background-color: #f2f2f2; /* Định dạng màu nền cho header của bảng */
}
</style>
