<template>
  <div class="index-container">
    <SideBar />

    <section class="home">
      <!-- main -->
      <div class="main">
        <!-- search bar -->
        <Search v-model="searchText" />
        <!-- main menus / order -->
        <div class="main-menus">
          <!-- List of books -->
          <div class="main-product">
            <h2 class="main-title">Chọn sách</h2>

            <!-- product wrapper -->
            <div class="product-wrapper">
              <div
                v-for="book in filteredProducts"
                :key="book.id"
                class="product-list"
                @click="() => goToDetailsBook(book)"
              >
                <!-- <router-link :to="{
                                    name: 'book.details',
                                    params: { id: book.id },
                                }"></router-link> -->
                <img class="product-img" :src="book.thumbnail" />
                <div class="product-desc">
                  <div class="product-name">
                    <h4>{{ book.name }}</h4>
                    <p class="price">{{ book.price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination component -->
          <Pagination
            :totalPages="totalPages"
            :currentPage="currentPage"
            :length="length"
            @update:currentPage="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
// attach sidebar into shopIndex
import SideBar from '@/components/SideBar.vue'
import Pagination from '@/components/Pagination.vue'
import Search from '@/components/SearchBar.vue'

import booksService from '@/services/books.service'

// Define the variables with `ref` if they're reactive
const currentPage = ref(1)
const totalPages = ref(1)
const length = 5

const searchText = ref('')
const books = ref([])

// // Comnputed

const searchableProducts = computed(() =>
  books.value.map((book) => {
    const { id, name, price, thumbnail, categoryName } = book
    return [id, name, price, thumbnail, categoryName].join('')
  })
)

const filteredProducts = computed(() => {
  if (!searchText.value) {
    // const data = books.value;
    const data = books.value
    console.log(data)
    return data
  }
  console.log(books.value)
  return books.value.filter((books, index) =>
    searchableProducts.value[index].includes(searchText.value)
  )
})

// Method
const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

const $router = useRouter()

const goToDetailsBook = (book) => {
  $router.push({
    name: 'book.details',
    params: { id: book.id },
    query: { book: JSON.stringify(book) }
  })
}

async function retrieveBooks(page) {
  try {
    const chunk = await booksService.getBooks(page) // Gọi API để lấy danh sách sách
    //console.log(chunk)
    totalPages.value = chunk.metadata.lastPage ?? 1 // Cập nhật tổng số trang
    //console.log(chunk.metadata.lastPage)
    books.value = chunk.products // Lưu danh sách sách từ API vào biến books
    console.log(books.value)
  } catch (error) {
    console.log(error) // Xử lý lỗi nếu có
  }
}

// When this component is mounted, load the first page of contacts
onMounted(() => retrieveBooks(1))

// When currentPage changes, fetch contacts for currentPage
watchEffect(() => retrieveBooks(currentPage.value))
</script>

<style>
html {
  scroll-behavior: smooth;
}

:root {
  --primaryColor: #96c93e;
  --secondaryColor: #ffc107;
  --whiteColor: #fff;
  --blackColor: #222;
  --softGreenColor: #d9f2ee;
  --darkGreyColor: #a7a7a7;
  --greyColor: #f5f5f5;
}

.index-container {
  width: 100%;
  height: auto;
  display: flex;
}

.main {
  width: 100%;
  height: max-content;
  min-height: 100vh;
  padding: 2%;
  background-color: var(--softGreenColor);
}

.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--whiteColor);
  font-size: 20px;
  color: var(--primaryColor);
  text-decoration: none;
  padding: 0 10px;
  height: 40px;
  border-radius: 50%;
}

.cart:hover {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.main-highlight {
  margin: 3% 0;
  padding: 2%;
  background-color: var(--secondaryColor);
  border-radius: 8px;
}

.main-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.main-title {
  font-size: 20px;
}

.back,
.next {
  cursor: pointer;
}

.back:hover,
.next:hover {
  color: var(--primaryColor);
}

.main-menus {
  min-height: 100%;
  height: 100%;
  background-color: var(--greyColor);
  padding: 2%;
  border-radius: 8px;
  margin-top: 20px;
}

.main-product {
  margin: 1rem 0 1.5rem 0;
}

.product-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  width: 100%;
  margin-top: 1rem;
  gap: 1%;
  border-radius: 8px;
}

.product-list {
  min-height: auto;
  height: 100%;
  background-color: var(--whiteColor);
  border-radius: 8px;
  margin: 1% 0;
  box-shadow: rgba(176, 176, 176, 0.2) 0px 2px 8px 0px;
  cursor: pointer;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
}

.product-list:hover {
  box-shadow: rgba(149, 157, 165, 0.2) 0 px 8px 24px;
  opacity: 1;
  transform: translateY(0);
}

.product-img {
  width: 100%;
  height: auto;
  min-height: 430px;
  border-radius: 8px;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.8);
}

.product-desc {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 3%;
  width: 100%;
}

.price {
  color: var(--primaryColor);
}

.product-list:hover .product-img {
  filter: opacity(1);
}

.product-list:hover .product-name h4 {
  color: var(--primaryColor);
}

.product-list:hover .price {
  letter-spacing: 1.5px;
}

body::-webkit-scrollbar {
  width: 5px;
}

body::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

body::-webkit-scrollbar-thumb {
  background-color: var(--primaryColor);
  outline: 1px solid var(--primaryColor);
}

.home {
  height: 100vh;
  width: calc(100% - 240px);
  position: relative;
  left: 240px;
  background: var(--body-color);
  transition: var(--tran-05);
}

.sidebar.close ~ .home {
  width: calc(100% - 88px);
  left: 88px;
}
</style>
