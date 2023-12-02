<template>
  <div class="pagination-body">
    <div class="pagination-container">
      <!-- Previous Page Button -->
      <div class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          class="page-link"
          :disabled="currentPage === 1"
          @click.prevent="goToPage(currentPage - 1)"
        >
          <span>&laquo;</span>
        </button>
      </div>

      <!-- Page Numbers as Buttons -->
      <div v-for="page in pages" :key="page">
        <button
          class="page-link"
          @click.prevent="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Page Button -->
      <div class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          class="page-link"
          :disabled="currentPage === totalPages"
          @click.prevent="goToPage(currentPage + 1)"
        >
          <span>&raquo;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    default: 3
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:currentPage'])

const pages = computed(() => {
  const start = Math.max(1, props.currentPage - Math.floor(props.length / 2))
  const end = Math.min(start + props.length - 1, props.totalPages)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const activePage = ref(props.currentPage)

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    activePage.value = page
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
.pagination-body,
.pagination-container,
.button,
.page-link {
  display: flex;
  align-items: center;
  justify-content: center;
}
button {
  border: none;
  transition: all 0.25s ease;
}
button:disabled {
  color: #b3b3b3;
  pointer-events: none;
}
.page-link {
  height: 45px;
  width: 45px;
  font-size: 20px;
  color: #666666;
  background-color: #f2f2f2;
  border-radius: 6px;
  transition: all 0.25s ease;
}

.pagination-container {
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  column-gap: 12px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.page-link {
  text-decoration: none; /* Remove underline for links */
  cursor: pointer;
  column-gap: 12px;
  font-weight: 500;
}
.button:hover,
.page-link:hover {
  color: #fff;
  background: var(--primaryColor);
}
.page-link.active {
  color: #fff;
  background: var(--primaryColor);
}
</style>
