<template>
  <div class="authentication-container">
    <div class="container" :class="{ active: isSignup }">
      <div class="forms">
        <!-- Login form container -->
        <div class="form login">
          <span class="title">Login</span>

          <form action="#" @submit.prevent="login">
            <!-- Email -->
            <div class="input-field">
              <input
                type="text"
                placeholder="Enter your phone number"
                v-model="phone_number"
                required
              />
              <i class="uil uil-envelope-alt icon"></i>
            </div>
            <!-- Password -->
            <div class="input-field">
              <input
                type="password"
                class="password"
                placeholder="Enter your password"
                v-model="password"
                required
              />
              <i class="uil uil-lock icon"></i>
              <i class="uil uil-eye-slash showHidePw" @click="togglePassword"></i>
            </div>

            <!-- User account "Remember me" checkbox -->
            <div class="checkbox-text">
              <div class="checkbox-content">
                <input type="checkbox" id="logCheck" />
                <label for="logCheck" class="text">Remember me</label>
                <p v-if="error" style="color: red">{{ error }}</p>
              </div>
              <!-- <a href="#" class="text">Forgot password?</a> -->
            </div>

            <!-- Login button -->
            <div class="input-field button">
              <input type="submit" value="Login Now" />
            </div>
          </form>

          <div class="login-signup">
            <span class="text">
              Don't have an account?
              <a href="#" class="text signup-link" @click="toggleForm">Signup now</a>
            </span>
          </div>
        </div>

        <!-- Registration form container -->
        <div class="form signup">
          <span class="title">Registration</span>

          <form action="#">
            <!-- Name -->
            <div class="input-field">
              <input type="text" placeholder="Enter your name" v-model="fullname" required />
              <i class="uil uil-user icon"></i>
            </div>
            <!-- Email -->
            <div class="input-field">
              <input
                type="text"
                placeholder="Enter your phone number"
                v-model="phone_number"
                required
              />
              <i class="uil uil-envelope-alt icon"></i>
            </div>
            <!-- Password -->
            <div class="input-field">
              <input
                type="password"
                class="password"
                placeholder="Create new password"
                v-model="password"
                required
              />
              <i class="uil uil-lock icon"></i>
            </div>
            <!-- Confirm Password -->
            <div class="input-field">
              <input
                type="password"
                class="password"
                placeholder="Confirm password"
                v-model="re_password"
                required
              />
              <i class="uil uil-lock icon"></i>
              <i class="uil uil-eye-slash showHidePw" @click="togglePassword"></i>
            </div>

            <div class="checkbox-text">
              <div class="checkbox-content">
                <input type="checkbox" id="signCheck" />
                <label for="signCheck" class="text">Remember me</label>
              </div>
            </div>

            <!-- Sign Up button -->
            <div class="input-field button">
              <input type="button" value="Sign Up" @click="signUp" />
            </div>

            <div class="login-signup">
              <span class="text">
                Already have an account?
                <a href="#" class="text login-link" @click="toggleForm">Login now</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import makeAuthService from '../services/users.service' // Import service từ file makeAuthService.js

// Gọi hàm loginUser từ service

const isSignup = ref(false)
import { useRouter } from 'vue-router'
const router = useRouter()
const togglePassword = () => {
  const pwFields = document.querySelectorAll('.password')
  const pwShowHide = document.querySelectorAll('.showHidePw')
  pwFields.forEach((pwField) => {
    if (pwField.type === 'password') {
      pwField.type = 'text'

      pwShowHide.forEach((icon) => {
        icon.classList.replace('uil-eye-slash', 'uil-eye')
      })
    } else {
      pwField.type = 'password'

      pwShowHide.forEach((icon) => {
        icon.classList.replace('uil-eye', 'uil-eye-slash')
      })
    }
  })
}

const toggleForm = () => {
  isSignup.value = !isSignup.value
}
const fullname = ref('')
const phone_number = ref('')
const password = ref('')
let error = ''
const re_password = ref('')

const login = async () => {
  try {
    const { ok, data } = await makeAuthService.loginUser(phone_number.value, password.value)

    if (ok) {
      localStorage.setItem('access_token', data.responseData.access_token)
      localStorage.setItem('fullname', data.responseData.fullname)
      localStorage.setItem('id', data.responseData.id)
      localStorage.setItem('phone_number', data.responseData.phone_number)
      localStorage.setItem('address', data.responseData.address)
      localStorage.setItem('role_id', data.responseData.role_id)
      localStorage.setItem('avatar', data.responseData.avatar)
      localStorage.setItem('isLoggedIn', 1)
      const userRole = data.responseData.role_id
      console.log(userRole)

      // Dựa trên vai trò, chuyển hướng tới các trang khác nhau
      if (userRole == 2) {
        // Chuyển hướng tới trang admin
        router.push('/admin') // Sử dụng router của bạn để chuyển hướng
      } else if (userRole == 1) {
        // Chuyển hướng tới trang người dùng thông thường
        router.push('/')
      }
    } else {
      error = data.message
    }
  } catch (err) {
    console.error('Đã xảy ra lỗi:', err)
    error = 'Đã xảy ra lỗi khi đăng nhập'
  }
}

const signUp = async () => {
  if (password.value !== re_password.value) {
    error = 'Mật khẩu nhập lại không khớp'
    return // Ngăn chặn gửi thông tin nếu mật khẩu không khớp
  }

  try {
    const response = await makeAuthService.registerUser({
      fullname: fullname.value, // Thêm các thông tin khác từ form đăng ký
      phone_number: phone_number.value,
      password: password.value
    })
    console.log({
      fullname: fullname.value, // Thêm các thông tin khác từ form đăng ký
      phone_number: phone_number.value,
      password: password.value
    })
    if (response.ok) {
      // Xử lý sau khi đăng ký thành công
    } else {
      error = response.message || 'Đã xảy ra lỗi khi đăng ký' // Hiển thị thông báo lỗi từ server nếu có
    }
  } catch (err) {
    console.error('Đã xảy ra lỗi:', err)
    error = 'Đã xảy ra lỗi khi đăng ký'
  }
}
</script>

<style scoped>
/* Disable Edge default eye icon avoid dupplicate */
input::-ms-reveal {
  display: none;
}

/* authentication-container acts like body wraps the whole authentication div*/
.authentication-container {
  --primary-color-form: #4070f4;
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color-form);
}

.container {
  position: relative;
  max-width: 430px;
  width: 100%;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.container .forms {
  display: flex;
  width: 200%;
  height: 440px;
  align-items: center;
  transition: height 0.2s ease;
}

.container .form {
  width: 50%;
  padding: 30px;
  background-color: #fff;
  transition: margin-left 0.18s ease;
}

.container.active .login {
  margin-left: -50%;
  opacity: 0;
  transition: margin-left 0.18s ease, opacity 0.15s ease;
}

.container .signup {
  opacity: 0;
  transition: opacity 0.09s ease;
}

.container.active .signup {
  opacity: 1;
  transition: opacity 0.2s ease;
}

.container.active .forms {
  height: 600px;
}

.container .form .title {
  position: relative;
  font-size: 27px;
  font-weight: 600;
}

.form .title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 30px;
  background-color: var(--primary-color-form);
  border-radius: 25px;
}

.form .input-field {
  position: relative;
  height: 50px;
  width: 100%;
  margin-top: 30px;
}

.input-field input {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0 35px;
  border: none;
  outline: none;
  font-size: 16px;
  border-bottom: 2px solid #ccc;
  border-top: 2px solid transparent;
  transition: all 0.2s ease;
}

/* input field focus */
.input-field input:is(:focus, :valid) {
  border-bottom-color: var(--primary-color-form);
}

.input-field i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 23px;
  transition: all 0.2s ease;
}

/* icons focus */
.input-field input:is(:focus, :valid) ~ i {
  color: var(--primary-color-form);
}

.input-field i.icon {
  left: 0;
}

.input-field i.showHidePw {
  right: 0;
  cursor: pointer;
  padding: 10px;
}

.form .checkbox-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.checkbox-text .checkbox-content {
  display: flex;
  align-items: center;
}

.checkbox-content input {
  margin: 0 8px -2px 4px;
  accent-color: var(--primary-color-form);
}

.form .text {
  color: #333;
  font-size: 14px;
}

.form a.text {
  color: var(--primary-color-form);
  text-decoration: none;
}

.form a:hover {
  text-decoration: underline;
}

.form .button {
  margin-top: 35px;
}

.form .button input {
  border: none;
  color: #fff;
  background-color: var(--primary-color-form);
  letter-spacing: 1px;
  border-radius: 6px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button input:hover {
  background-color: #265df2;
}

.form .login-signup {
  margin-top: 30px;
  text-align: center;
}
</style>