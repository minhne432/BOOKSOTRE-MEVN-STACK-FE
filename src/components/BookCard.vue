<template>
  <div class="book-details">
    <div class="details">
      <div><strong>Tên sách:</strong> {{ bookdetails.name }}</div>
      <div><strong>Thể loại:</strong> {{ bookdetails.categoryName }}</div>
      <div><strong>Mô tả:</strong> {{ bookdetails.description }}</div>
      <div><strong>Giá:</strong> {{ bookdetails.price }}</div>
    </div>
    <div class="image-preview" v-if="bookdetails.thumbnail">
      <img :src="bookdetails.thumbnail" alt="Product Image" />
    </div>
    <form @submit.prevent="submitOrder">
      <label for="quantity">Số lượng:</label>
      <input type="number" id="quantity" v-model="quantity" min="1" required />
      <button type="submit">Thêm vào giỏ hàng</button>
    </form>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
const $emit = defineEmits(['submit:order'])
const props = defineProps({
  initialBook: { type: Object, required: true }
})

const bookdetails = ref({ ...props.initialBook })
const quantity = ref(1)

function submitOrder() {
  const orderDetails = {
    bookDetails: bookdetails.value,
    quantity: quantity.value
  }
  $emit('submit:order', orderDetails)
}
</script>

<style scoped>
.book-details {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.details {
  margin-bottom: 15px;
}

.details div {
  margin-bottom: 5px;
}

.image-preview {
  max-width: 150px;
  margin-top: 10px;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input[type='number'] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
}

button[type='submit'] {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover {
  background-color: #0056b3;
}

/* Căn giữa nội dung trong book-details */
.details div {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Thay đổi màu chữ và font chữ */
.book-details {
  color: #333;
  font-family: Arial, sans-serif;
}

/* Hiệu ứng khi hover nút "Thêm vào giỏ hàng" */
button[type='submit'] {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type='submit']:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Nâng cao phần viền cho nút submit */
button[type='submit'] {
  border: 1px solid #007bff;
}

/* Căn chỉnh và kích thước input số lượng */
input[type='number'] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 20px); /* Tạo khoảng cách */
  margin-bottom: 15px;
  box-sizing: border-box;
}
</style>
