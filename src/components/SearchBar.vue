<template>
  <div class="input-box">
    <input
      type="text"
      id="search-item"
      placeholder="Search..."
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', e.target.value)"
      @keyup.enter="$emit('submit')"
    />
    <span class="search">
      <i class="uil uil-search search-icon"></i>
    </span>
    <i class="uil uil-times close-icon"></i>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Search book names
const { modelValue } = defineProps({
  modelValue: { type: String, default: '' }
})

const $emit = defineEmits(['submit', 'update:modelValue'])


// Open and close the search bar
onMounted(() => {
  const inputBox = document.querySelector('.input-box')
  const search = document.querySelector('.search')
  const closeIcon = document.querySelector('.close-icon')

  search.addEventListener('click', () => inputBox.classList.add('open'))
  closeIcon.addEventListener('click', () => inputBox.classList.remove('open'))
})
</script>

<style scoped>
/* Search box */
.input-box {
  position: relative;
  height: 55px;
  max-width: 60px;
  width: 100%;
  margin: 0 40px;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.input-box.open {
  max-width: 450px;
  margin: 0;
}
.input-box input {
  position: relative;
  outline: none;
  border: none;
  height: 100%;
  width: 100%;
  padding: 0 15px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 400;
  color: var(--blackColor);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.input-box.open input {
  padding: 0 15px 0 65px;
}
.input-box .search {
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
  width: 60px;
  border-radius: 6px;
  background-color: #fff;
  left: 0;
  top: 0;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.input-box.open .search {
  border-radius: 6px 0 0 6px;
}
/* Search icon */
.search .search-icon {
  font-size: 30px;
  color: var(--primaryColor);
  transform: rotate(90deg);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.input-box.open .search-icon {
  transform: rotate(0deg);
}
/* Close icon */
.input-box .close-icon {
  position: absolute;
  right: -45px;
  top: 50%;
  font-size: 30px;
  transform: translateY(-50%);
  padding: 5px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.input-box.open .close-icon {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(-50%) rotate(180deg);
}
</style>
