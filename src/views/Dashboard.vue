<template>
  <Sidebar />
  <div class="home">
    <div class="dashboard">
      <div class="info-card">
        <h2>Doanh thu</h2>
        <p class="count square-border green">100</p>
      </div>
      <div class="info-card">
        <h2>Số lượng sách bán được</h2>
        <p class="count square-border blue">50</p>
      </div>
      <div class="info-card">
        <h2>Số người dùng đăng ký mới</h2>
        <p class="count square-border orange">20</p>
      </div>
    </div>
    <div class="center-container">
      <div class="chart-container">
        <canvas id="myChart"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
// import Datepicker from 'vue-datepicker'
import Sidebar from '@/components/Sidebar.vue'
const chartData = ref([12, 1, 3, 5, 2, 3, 12, 1, 3, 5, 2, 3]) // Đây là biến ref chứa dữ liệu của biểu đồ
// const selectedDate = ref(new Date())
onMounted(() => {
  const ctx = document.getElementById('myChart')

  // Khởi tạo biểu đồ
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [12, 19, 3, 5, 2, 3, 10, 15, 8, 13, 7, 9],
      datasets: [
        {
          label: 'Doanh thu',
          data: chartData.value, // Sử dụng giá trị từ biến ref

          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })

  // Watch để theo dõi sự thay đổi của biến ref và cập nhật biểu đồ khi cần thiết
  watch(chartData, () => {
    myChart.data.datasets[0].data = chartData.value
    myChart.update()
  })
})

// // Giả sử bạn có một hàm hoặc sự kiện nào đó để cập nhật giá trị của biến ref chartData
// function updateChartData() {
//   chartData.value = [/* Your updated data array */];
// }
</script>
<style scoped>
.dashboard {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
}

.info-card {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 250px;
  margin: 0 10px;
}

.info-card h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.count {
  font-size: 24px;
  font-weight: bold;
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.square-border {
  border-radius: 50%;
  display: inline-block;
}

.green {
  background-color: #6abf69;
  color: white;
}

.blue {
  background-color: #5a98d6;
  color: white;
}

.orange {
  background-color: #f69445;
  color: white;
}

.chart-container {
  position: relative;
  width: 100%; /* Thiết lập chiều rộng tùy thuộc vào kích thước của khung hình */
  height: 300px; /* Thiết lập chiều cao tùy ý */
}

.chart-container canvas {
  width: 100%;
  height: 100%;
}

.center-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-left: 120px;
  margin-top: 100px;
}

.chart-container {
  position: relative;
  width: 80%; /* Đặt chiều rộng tùy theo nhu cầu của bạn */
  height: 300px; /* Thiết lập chiều cao tùy ý */
}

.chart-container canvas {
  width: 100%;
  height: 100%;
}
</style>