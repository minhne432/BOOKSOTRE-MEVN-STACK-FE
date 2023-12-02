<script setup>
import { ref } from "vue";
import {  useRoute } from "vue-router";
import SideBar  from '@/components/SideBar.vue';
import BookCard from '@/components/BookCard.vue';
import orderService from "../services/order.service";
const props = defineProps({
    bookId: { type: String, required: true },
});

const $route = useRoute();
const book = ref(null);
const message = ref("");

async function getBook() {
    try {
        book.value = JSON.parse(decodeURIComponent($route.query.book));
        console.log(book.value)
    } catch (error) {
        console.error('Error parsing book data:', error);
        // Handle the error, e.g., redirect to an error page or display a message
    }
}

async function addToCart(details) {
    const cartDetails = {
        product_id: details.bookDetails.id,
        quantity: details.quantity,
        user_id: localStorage.getItem('id')
    }
    try {
        await orderService.addToCart(cartDetails);
        message.value = "Sách được cập nhật thành công.";
    } catch (error) {
        console.log(error);
    }
}

getBook(props.bookId);
</script>
<template>
    <SideBar />
    <div v-if="book" class="page">
        <h4>Chi tiết sách</h4>
        <BookCard :initial-book="book" @submit:order="addToCart"/>
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