<template>
  <div class="dashboard">
    <header class="header">
      <span>一些基本的图表</span>
    </header>

    <div class="charts-container">
      <el-form-item label="数据量">
        <el-input-number v-model="searchNumber" @change="handleChange" />
      </el-form-item>
      <div class="chart-row">
        <div class="chart-card">
          <div ref="barChart" class="chart"></div>
        </div>
        <div class="chart-card">
          <div ref="lineChart" class="chart"></div>
        </div>
      </div>
      <div class="chart-row">
        <div class="chart-card">
          <div ref="pieChart" class="chart"></div>
        </div>
        <div class="chart-card">
          <div ref="line2Chart" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { listBbb } from "@/common/apis/bbb/bbb"
const { proxy } = getCurrentInstance();
const echarts = proxy.$echarts

// 图表引用
const searchNumber = ref(30)
const barChart = ref(null)
const lineChart = ref(null)
const pieChart = ref(null)
const line2Chart = ref(null)
const handleChange = async () => {

  await initCharts()
}
// 图表实例
let barChartInstance = null
let lineChartInstance = null
let pieChartInstance = null
let line2ChartInstance = null

// 初始化图表
async function initCharts() {
  let data = await listBbb({
    pageSize: searchNumber.value,
    pageNum: 1
  })
  data = data.data.rows
  let sexCount = data.map(obj => obj.sex).reduce((acc, sex) => {
    acc[sex] = (acc[sex] || 0) + 1
    return acc
  }, {});

  // 柱状图
  barChartInstance.setOption({
    title: { text: '成绩数据', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(obj => obj.name)
    },
    yAxis: { type: 'value' },
    series: [{
      name: '成绩',
      type: 'bar',
      data: data.map(obj => obj.score),
      itemStyle: { color: '#5470c6' }
    }]
  })

  // 折线图
  lineChartInstance.setOption({
    title: { text: '年龄数据', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(obj => obj.name)
    },
    yAxis: { type: 'value' },
    series: [{
      name: '年龄',
      type: 'line',
      data: data.map(obj => obj.age),
      smooth: true,
      itemStyle: { color: '#91cc75' }
    }]
  })

  // 饼图
  pieChartInstance.setOption({
    title: { text: '性别占比', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      name: '性别占比',
      type: 'pie',
      radius: '60%',
      data: [{
        name: '男',
        value: sexCount['男']
      }, {
        name: '女',
        value: sexCount['女']
      }],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  // 雷达图
  line2ChartInstance.setOption({
    title: { text: '年龄和成绩对比', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(obj => obj.name)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '年龄',
        type: 'line',
        data: data.map(obj => obj.age),
        smooth: true,
        itemStyle: { color: '#91cc75' }
      },
      {
        name: '成绩',
        type: 'line',
        data: data.map(obj => obj.score), // 假设成绩字段为 score
        smooth: true,
        itemStyle: { color: '#5470c6' }   // 使用不同颜色区分
      }
    ]
  })
}

// 响应式调整
function resizeCharts() {
  barChartInstance?.resize()
  lineChartInstance?.resize()
  pieChartInstance?.resize()
  line2ChartInstance?.resize()
}

onMounted(async () => {
  // 初始化图表实例
  barChartInstance = echarts.init(barChart.value)
  lineChartInstance = echarts.init(lineChart.value)
  pieChartInstance = echarts.init(pieChart.value)
  line2ChartInstance = echarts.init(line2Chart.value)

  // 渲染图表
  await initCharts()

  window.addEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.dashboard {
  text-align: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

/* 标题 */
.header span {
  font-size: 20pt;
  color: #333;
  font-weight: 600;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 350px;
}
</style>