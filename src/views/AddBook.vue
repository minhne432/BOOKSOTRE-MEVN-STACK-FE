<script setup>
import { ref } from "vue";

import BookForm from "@/components/BookForm.vue";
import booksService from "@/services/books.service";
import SideBar from '@/components/SideBar.vue';

const book = ref(null);
const message = ref("");



async function onAddBook(newBook) {
  try {
await booksService.createBook(newBook);

    message.value = "Sách được thêm thành công.";
  } catch (error) {
    console.log(error);
  }
}



</script>

<template>
  <SideBar />
  <div class="page">
    <h4>Thêm Sách</h4>
    <BookForm :initial-book="book || {}" @submit:book="onAddBook" />
    <p>{{ message }}</p>
  </div>
</template>

<style>

.page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page h4 {
  text-align: center;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

.page p {
  text-align: center;
  margin-top: 20px;
  color: #888;
}
</style>