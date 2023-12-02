<template>
  <SideBar />
  <div class="home">
    <div class="profile">
      <h1>User Profile</h1>
      <div class="avatar">
        <img :src="userAvatar" alt="User Avatar" />
        <!-- Điều khiển hiển thị của input -->
        <input v-if="editing" type="file" id="image" ref="imageInput" @change="handleImageUpload" />
      </div>
      <div class="info">
        <p>
          <strong>ID:</strong> <span id="user-id">#{{ user_id }}</span>
        </p>
        <p>
          <strong>Full Name:</strong>
          <span v-if="!editing">{{ fullName }}</span>
          <input v-else v-model="editedFullName" class="edit-form" />
        </p>
        <p>
          <strong>Phone Number:</strong>
          <span v-if="!editing">{{ phone_number }}</span>
          <input v-else v-model="editedPhoneNumber" class="edit-form" />
        </p>
        <p>
          <strong>Address:</strong>
          <span v-if="!editing">{{ address }}</span>
          <input v-else v-model="editedAddress" class="edit-form" />
        </p>
        <button @click="toggleEdit" class="edit-button">{{ editing ? 'Save' : 'Edit' }}</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import SideBar from '@/components/SideBar.vue'

const fullName = ref('')
const editedFullName = ref('')
const phone_number = ref('')
const editedPhoneNumber = ref('')
const address = ref('')
const editedAddress = ref('')
const user_id = ref(0)
const editing = ref(false)
const selectedImage = ref(null)
const userAvatar = ref(localStorage.getItem('avatar'))
onMounted(() => {
  fullName.value = localStorage.getItem('fullname')
  editedFullName.value = fullName.value
  phone_number.value = localStorage.getItem('phone_number')
  editedPhoneNumber.value = phone_number.value
  address.value = localStorage.getItem('address')
  editedAddress.value = address.value
  user_id.value = localStorage.getItem('id')
})

const toggleEdit = async () => {
  if (editing.value) {
    // Lưu thông tin chỉnh sửa vào localStorage hoặc backend tùy vào nhu cầu
    localStorage.setItem('fullname', editedFullName.value)
    localStorage.setItem('phone_number', editedPhoneNumber.value)
    localStorage.setItem('address', editedAddress.value)

    // Tắt chế độ chỉnh sửa
    editing.value = false

    const userId = localStorage.getItem('id')
    const formData = new FormData()

    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    formData.append('fullname', editedFullName.value)
    formData.append('phone_number', editedPhoneNumber.value)
    formData.append('address', editedAddress.value)

    const requestOptions = {
      method: 'PUT',
      body: formData
      // Không cần thiết lập header 'Content-Type' vì FormData sẽ tự động thiết lập header phù hợp
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, requestOptions)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      console.log('Updated successfully:', data)
      localStorage.setItem('avatar', data.avatar)
    } catch (error) {
      console.error('Error updating user:', error)
    }
  } else {
    // Mở chế độ chỉnh sửa
    editing.value = true
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  selectedImage.value = file
  console.log(selectedImage.value)

  const reader = new FileReader()
  reader.onload = () => {
    // Hiển thị ảnh trước khi lưu
    userAvatar.value = reader.result
  }

  if (file) {
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

.profile {
  width: 80%;
  margin: 20px auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.profile h1 {
  text-align: center;
}

.info {
  margin-top: 20px;
}

.info p {
  margin-bottom: 10px;
}

.info strong {
  font-weight: bold;
}

.avatar {
  text-align: center;
}

.avatar img {
  width: 150px;
  /* Điều chỉnh kích thước ảnh đại diện tại đây */
  height: 150px;
  border-radius: 50%;
  /* Làm tròn góc để tạo hiệu ứng avatar */
  object-fit: cover;
  /* Đảm bảo ảnh vừa với khu vực chỉ định */
  border: 3px solid #fff;
  /* Đổi màu khung ảnh nếu muốn */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Để tùy chỉnh màu sắc, font, hoặc bất kỳ thuộc tính CSS nào khác, chỉ cần thay đổi giá trị trong CSS. */

.edit-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #2980b9;
}

/* CSS cho form chỉnh sửa */
.edit-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.edit-form input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.edit-form input[type='submit'] {
  grid-column: span 2;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-form input[type='submit']:hover {
  background-color: #27ae60;
}
</style>
