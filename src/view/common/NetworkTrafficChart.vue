<template>
  <div ref="chart" style="height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
      loading: false,
      error: null,
      trafficData: [] // 存储网络流量数据
    };
  },
  mounted() {
    this.initChart();
    this.fetchData(); // 初始获取数据
    this.interval = setInterval(this.fetchData, 5000); // 每5秒获取一次数据

    // WebSocket连接
    this.socket = new WebSocket('ws://localhost:8084/ws');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket Data:", data); // 打印接收的数据
      this.updateChartWithRealData(data);
    };
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: '网络流量' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['上行', '下行'] },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} KB'
          }
        },
        series: [
          { name: '上行', type: 'line', data: [] },
          { name: '下行', type: 'line', data: [] }
        ]
      });

      // 使用示例数据测试图表渲染
      const sampleData = { timestamp: Date.now(), netBytesSent: 500, netBytesRecv: 300 };
      this.updateChartData(sampleData);
    },


    async fetchData() {
      try {
        this.loading = true;
        const response = await fetch('http://localhost:8084/api/metrics/latest');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // 添加日志以调试
        this.updateChartData(data);
      } catch (error) {
        console.error('获取数据失败:', error);
        this.error = '获取数据失败';
      } finally {
        this.loading = false;
      }
    },
    updateChartData(data) {
      if (!this.chartInstance || !data) return;

      // 限制数据点数量，防止内存问题
      const maxDataPoints = 60;

      // 获取当前图表选项
      const option = this.chartInstance.getOption();

      // 准备新数据
      const newTimeData = [...option.xAxis[0].data, new Date(data.timestamp).toLocaleTimeString()];
      const newUploadData = [...option.series[0].data, data.netBytesSent / 1024]; // 转换为KB
      const newDownloadData = [...option.series[1].data, data.netBytesRecv / 1024]; // 转换为KB

      // 限制数据点数量
      if (newTimeData.length > maxDataPoints) {
        newTimeData.shift();
        newUploadData.shift();
        newDownloadData.shift();
      }

      // 更新图表
      this.chartInstance.setOption({
        xAxis: { data: newTimeData },
        series: [
          { data: newUploadData },
          { data: newDownloadData }
        ]
      });
    },

    updateChartWithRealData(data) {
      if (!this.chartInstance || !data) return;

      // 这里可以直接使用WebSocket推送的数据更新图表
      this.updateChartData(data);
    },

    handleResize() {
      this.chartInstance && this.chartInstance.resize();
    }
  },
  beforeUnmount() {
    if (this.interval) clearInterval(this.interval);
    if (this.socket) this.socket.close();
    window.removeEventListener('resize', this.handleResize);
    this.chartInstance && this.chartInstance.dispose();
  }
};
</script>