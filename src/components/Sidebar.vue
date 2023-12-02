<template>
  <nav class="sidebar" :class="{ close: !isSidebarOpen }">
    <header>
      <div class="image-text">
        <span class="image">
          <img src="@/assets/logo.png" alt="logo" />
        </span>

        <div class="text header-text">
          <span class="name">PerfumeShop</span>
        </div>
      </div>

      <i class="bx bx-chevron-right toggle" @click="toggleSidebar"></i>
    </header>

    <div class="menu-bar">
      <div class="menu">
        <ul class="menu-links">
          <!-- Home -->
          <li class="nav-links">
            <!-- <a :href="goToHome()"> -->
            <router-link v-if="shouldShowLink" :to="{ name: 'Home' }">
              <i class="bx bx-home-alt icon"></i>
              <span class="text nav-text">Home</span>
            </router-link>
            <router-link v-if="!shouldShowLink" :to="{ name: 'admin' }">
              <i class="bx bx-home-alt icon"></i>
              <span class="text nav-text">Home</span>
            </router-link>

            <!-- </a> -->
          </li>
          <!-- cart -->
          <li class="nav-links">
            <router-link :to="{ name: 'cart' }">
              <i class="bx bx-cart icon"></i>
              <span class="text nav-text">Cart</span>
            </router-link>
          </li>
          <!-- Profile -->
          <li class="nav-links">
            <router-link :to="{ name: 'user.home' }">
              <i class="bx bx-user icon"></i>
              <span class="text nav-text">Profile</span>
            </router-link>
          </li>
          <!-- Setting -->
          <li class="nav-links">
            <router-link v-if="shouldShowLink" :to="{ name: 'myOrders' }">
              <i class="bx bx-shopping-bag icon"></i>
              <span class="text nav-text">Orders</span>
            </router-link>
            <router-link v-else :to="{ name: 'admin.orders' }">
              <i class="bx bx-shopping-bag icon"></i>
              <span class="text nav-text">Orders</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Logout section -->
      <div class="footer">
        <li v-if="!isLoggedIn">
          <router-link :to="{ name: 'login' }">
            <i class="bx bx-log-in icon"></i>
            <span class="text nav-text">Login</span>
          </router-link>
        </li>

        <!-- Logout button -->
        <li v-if="isLoggedIn">
          <button @click="logout()" class="router-like-button">
            <i class="bx bx-log-in icon"></i>
            <span class="text nav-text">Logout</span>
          </button>
        </li>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const shouldShowLink = computed(() => {
  const role_id = localStorage.getItem('role_id') != 2 ? true : false
  return role_id
})

const isLoggedIn = ref(localStorage.getItem('isLoggedIn'))

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('fullname')
  localStorage.removeItem('id')
  localStorage.removeItem('phone_number')
  localStorage.removeItem('address')
  localStorage.removeItem('role_id')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('avatar')
  router.push({ name: 'Home' })
}
</script>

<style>
body {
  height: 100vh;
  background: var(--body-color);
  transition: var(--tran-04);
}
/* ===== Sidebar ===== */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 240px;
  padding: 10px 14px;
  background: var(--sidebar-color);
  transition: var(--tran-05);
  z-index: 100;
}
/* use to calc shopindex page later */
.sidebar.close {
  width: 88px;
}
/* ===== Reusable CSS */
.sidebar .text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  transition: var(--tran-03);
  white-space: nowrap;
  opacity: 1;
}
.sidebar.close .text {
  opacity: 0;
}
.sidebar .image {
  min-width: 60px;
  display: flex;
  align-items: center;
}
.sidebar li {
  height: 50px;
  margin-top: 20px;
  list-style: none;
  display: flex;
  align-items: center;
}
.sidebar li .icon {
  min-width: 60px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar li .icon,
.sidebar li .text {
  color: var(--text-color);
  transition: var(--tran-02);
}
.sidebar header {
  position: relative;
}
.sidebar .image-text img {
  width: 55px;
  border-radius: 6px;
}

.sidebar header .image-text {
  display: flex;
  align-items: center;
}

header .image-text .header-text {
  display: flex;
  flex-direction: column;
}

.header-text .name {
  font-weight: 600;
}
.header-text .user-name {
  margin-top: -2px;
}

.sidebar header .toggle {
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translate(-50%) rotate(180deg);
  height: 25px;
  width: 27px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20%;
  color: var(--sidebar-color);
  font-size: 25px;
  transition: var(--tran-03);
}
.sidebar.close header .toggle {
  transform: translate(-50%);
}

.sidebar li a {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: var(--tran-04);
}

.sidebar li a:hover {
  background: var(--primary-color);
  border-radius: 5px;
}

.sidebar li a:hover .icon,
.sidebar li a:hover .text {
  color: var(--sidebar-color);
}

.sidebar .menu-bar {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.router-like-button {
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding: 0;
  font: inherit;
  outline: inherit;
  display: flex;
  align-items: center;
}
</style>
