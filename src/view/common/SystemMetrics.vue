<template>
  <h3>最新时间</h3>
  <p>{{ formattedTimestamp }}</p>
  <div class="system-metrics">
    <!-- Top Metrics -->
    <div class="top-metrics">
      <div class="metric-card">
        <h3>CPU 使用率</h3>
        <p>{{ cpuUsage }} %</p>
      </div>
      <div class="metric-card">
        <h3>内存占用</h3>
        <p>{{ memoryUsed }} GB</p>
        <small>内存总量 {{ memoryTotal }} GB</small>
      </div>
      <div class="metric-card">
        <h3>系统负载率</h3>
        <p>{{ systemLoad }} %</p>
      </div>
      <div class="metric-card">
        <h3>磁盘占用</h3>
        <p>{{ diskUsed }} GB</p>
        <small>磁盘总量 {{ diskTotal }} GB</small>
      </div>
    </div>

    <!-- Network Traffic Chart -->
    <div class="chart-container">
      <div class="chart-title">
        <span>网络流量</span>
        <button :class="{ active: isUpstream }" @click="toggleTraffic('up')">上行</button>
        <button :class="{ active: !isUpstream }" @click="toggleTraffic('down')">下行</button>
        <div class="time-range">
          <button v-for="range in timeRanges" :key="range.value" :class="{ active: selectedTimeRange === range.value }" @click="selectTimeRange(range.value)">
            {{ range.label }}
          </button>
        </div>
      </div>
      <div ref="trafficChart" class="chart"></div>
    </div>

    <!-- CPU and Memory Usage Charts -->
    <div class="charts">
      <div class="chart-container">
        <div class="chart-title">
          <span>CPU 使用率趋势</span>
          <div class="time-range">
            <button v-for="range in timeRanges" :key="range.value" :class="{ active: selectedTimeRange === range.value }" @click="selectTimeRange(range.value)">
              {{ range.label }}
            </button>
          </div>
        </div>
        <div ref="cpuChart" class="chart"></div>
      </div>
      <div class="chart-container">
        <div class="chart-title">
          <span>内存使用量趋势</span>
          <div class="time-range">
            <button v-for="range in timeRanges" :key="range.value" :class="{ active: selectedTimeRange === range.value }" @click="selectTimeRange(range.value)">
              {{ range.label }}
            </button>
          </div>
        </div>
        <div ref="memoryChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      cpuUsage: 0,
      memoryUsed: 0,
      memoryTotal: 0,
      systemLoad: 0,
      diskUsed: 0,
      diskTotal: 0,
      netBytesRecv: 0,
      netBytesSent: 0,
      timestamp: '',
      isUpstream: true,
      selectedTimeRange: 'hour',
      loading: false,
      error: null,
      timeRanges: [
        { label: '最近一小时', value: 'hour' },
        { label: '最近24小时', value: 'day' },
        { label: '近一周', value: 'week' }
      ],
      trafficData: [],
      cpuData: [],
      memoryData: [],
      socket: null,
      intervalId: null, // 用于存储定时器ID
      formattedTimestamp: '', // 新增用于存储格式化后时间的属性
    };

  },
  mounted() {
    this.fetchMetrics();
    this.initCharts();
    this.setupWebSocket();
    this.intervalId = setInterval(this.fetchMetrics, 5000); // 每5秒刷新一次数据
    window.addEventListener('resize', this.handleResize);
  }, beforeUnmount() {
    clearInterval(this.intervalId); // 组件销毁前清除定时器
    // ...现有代码
    if (this.socket) this.socket.close();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async fetchMetrics() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8084/api/metrics/latest');
        console.log("Latest Metrics Response:", response.data); // 输出API响应数据

        const metrics = response.data;
        this.cpuUsage = parseFloat(metrics.cpu_usage) || 0;
        this.memoryUsed = (parseFloat(metrics.memory_usage) * parseFloat(this.memoryTotal) / 100).toFixed(2) || 0;
        this.memoryTotal = 16; // 假设系统有16GB内存，或从API获取
        this.systemLoad = this.cpuUsage; // 如果没有system_load字段，可以使用cpu_usage
        this.diskUsed = (parseFloat(metrics.disk_usage) * 50 / 100).toFixed(2) || 0; // 假设磁盘50GB
        this.diskTotal = 50
        this.netBytesRecv = metrics.net_bytes_recv || 0;
        this.netBytesSent = metrics.net_bytes_sent || 0;
        this.timestamp = metrics.timestamp || '';

        console.log("Latest Metrics Response:", response.data);
        console.log("CPU Usage:", this.cpuUsage);
        console.log("Memory Used:", this.memoryUsed);
        console.log("Memory Total:", this.memoryTotal);
        console.log("System Load:", this.systemLoad);
        console.log("Disk Used:", this.diskUsed);
        console.log("Disk Total:", this.diskTotal);
        console.log("Net Bytes Recv:", this.netBytesRecv);
        console.log("Net Bytes Sent:", this.netBytesSent);
        console.log("Timestamp:", this.timestamp);

        this.fetchHistoricalData();
      } catch (error) {
        console.error("Error fetching metrics:", error);
        this.error = '获取数据失败，请稍后重试';
        console.error("Error fetching metrics:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchHistoricalData() {
      try {
        const response = await axios.get(`http://localhost:8084/api/metrics/historical?range=${this.selectedTimeRange}`);
        const data = response.data;

        this.trafficData = data.traffic;
        this.cpuData = data.cpu;
        this.memoryData = data.memory;

        this.updateCharts();
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    },
    handleResize() {
      this.$nextTick(() => {
        if (this.trafficChart) this.trafficChart.resize();
        if (this.cpuChart) this.cpuChart.resize();
        if (this.memoryChart) this.memoryChart.resize();
      });
    },
    initCharts() {
      this.trafficChart = echarts.init(this.$refs.trafficChart);
      this.cpuChart = echarts.init(this.$refs.cpuChart);
      this.memoryChart = echarts.init(this.$refs.memoryChart);
      this.updateCharts();
    },
    updateCharts() {
      const formatTimestamp = (timestamp) => {
        if (typeof timestamp === 'number' && timestamp.toString().length === 10) { // 判断是否为Unix时间戳（秒）
          return new Date(timestamp * 1000); // 转换为毫秒
        }
        return new Date(timestamp);
      };

      const safeFormatter = (params) => {
        if (!params || !params.length || params.some(p => p.value === undefined || p.value.length < 2)) {
          return '';
        }
        return `${formatTimestamp(params[0].value[0]).toLocaleString('zh-CN')}<br/>${params.map(p => `${p.seriesName}: ${p.value[1]}`).join('<br/>')}`;
      };

      const trafficOptions = {
        title: { text: '网络流量' },
        tooltip: { trigger: 'axis', formatter: safeFormatter },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: function (value, index) {
              return echarts.format.formatTime('yyyy-MM-dd HH:mm:ss', value);
            }
          },
          data: this.trafficData.map(d => formatTimestamp(d.timestamp))
        },
        yAxis: { type: 'value' },
        series: [
          { name: '上行', type: 'line', data: this.trafficData.map(d => [formatTimestamp(d.timestamp), d.net_bytes_sent]) },
          { name: '下行', type: 'line', data: this.trafficData.map(d => [formatTimestamp(d.timestamp), d.net_bytes_recv]) }
        ]
      };

      const cpuOptions = {
        title: { text: 'CPU 使用率趋势' },
        tooltip: { trigger: 'axis', formatter: safeFormatter },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: function (value, index) {
              return echarts.format.formatTime('yyyy-MM-dd HH:mm:ss', value);
            }
          },
          data: this.cpuData.map(d => formatTimestamp(d.timestamp))
        },
        yAxis: { type: 'value' },
        series: [
          { name: 'CPU 使用率', type: 'line', data: this.cpuData.map(d => [formatTimestamp(d.timestamp), d.cpu_usage]) }
        ]
      };

      const memoryOptions = {
        title: { text: '内存使用量趋势' },
        tooltip: { trigger: 'axis', formatter: safeFormatter },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: function (value, index) {
              return echarts.format.formatTime('yyyy-MM-dd HH:mm:ss', value);
            }
          },
          data: this.memoryData.map(d => formatTimestamp(d.timestamp))
        },
        yAxis: { type: 'value' },
        series: [
          { name: '内存使用量', type: 'line', data: this.memoryData.map(d => [formatTimestamp(d.timestamp), d.memory_usage]) }
        ]
      };

      this.$nextTick(() => {
        this.trafficChart.setOption(trafficOptions);
        this.cpuChart.setOption(cpuOptions);
        this.memoryChart.setOption(memoryOptions);
      });
    },
    toggleTraffic(direction) {
      this.isUpstream = direction === 'up';
      this.updateCharts();
    },
    selectTimeRange(range) {
      this.selectedTimeRange = range;
      this.fetchHistoricalData();
    },
    setupWebSocket() {
      this.socket = new WebSocket('ws://localhost:8084/ws'); // 或者使用 'wss://' 如果需要TLS/SSL
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 更新实时数据
        this.cpuUsage = data.cpu_usage;
        // 假设timestamp是ISO8601格式或Unix时间戳(秒)
        let date = new Date(data.timestamp);
        if(typeof data.timestamp === 'number' && data.timestamp.toString().length === 10) { // 判断是否为Unix时间戳（秒）
          date = new Date(data.timestamp * 1000); // 转换为毫秒
        }
        let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        this.formattedTimestamp = date.toLocaleString('zh-CN', options); // 格式化时间并更新到data属性

        // 其他字段更新...
      };

      this.socket.onopen = () => {
        console.log("WebSocket connection opened.");
      };

      this.socket.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
    }

  }
};
</script>

<style scoped>
.system-metrics {
  padding: 20px;
}

.top-metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.metric-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  width: 23%;
  text-align: center;
}

.chart-container {
  background: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chart-title button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.chart-title button.active {
  color: #007bff;
}

.chart {
  height: 300px;
}
</style>