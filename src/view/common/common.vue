<template>
  <div id="app" class="monitor-dashboard">
    <header class="dashboard-header">
      <h1>系统监控仪表盘</h1>
      <div class="last-updated">
        <span v-if="loading" class="loading-indicator">数据加载中...</span>
        <span v-else>最后更新: {{ lastUpdateTime }}</span>
      </div>
    </header>

    <main class="dashboard-content">
      <SystemMetrics
          class="metrics-section"
          :last-update="lastUpdateTime"
          @refresh="handleRefresh"
      />
      <NetworkTrafficChart
          class="traffic-section"
          :last-update="lastUpdateTime"
          @refresh="handleRefresh"
      />
    </main>
  </div>
</template>

<script>
import SystemMetrics from './SystemMetrics.vue';
import NetworkTrafficChart from './NetworkTrafficChart.vue';

export default {
  name: 'App',
  components: {
    SystemMetrics,
    NetworkTrafficChart,
  },
  data() {
    return {
      lastUpdateTime: null,
      loading: false,
      refreshInterval: 5000,
      refreshTimer: null
    };
  },
  methods: {
    updateTimestamp() {
      this.lastUpdateTime = new Date().toLocaleString();
    },
    handleRefresh() {
      this.loading = true;
      this.updateTimestamp();
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    startAutoRefresh() {
      this.refreshTimer = setInterval(() => {
        this.$refs.systemMetrics?.fetchMetrics();
        this.$refs.trafficChart?.fetchData();
        this.updateTimestamp();
      }, this.refreshInterval);
    }
  },
  mounted() {
    this.updateTimestamp();
    this.startAutoRefresh();
  },
  beforeUnmount() {
    clearInterval(this.refreshTimer);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* 移除了 max-width: 1400px; 或者可以根据需要调整 */
  margin: 0 auto;
  padding: 20px;
}

.monitor-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
}

.loading-indicator {
  color: #007bff;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 992px) {
  .dashboard-content {
    grid-template-columns: 1fr 1fr; /* 双列布局 */
  }
}

.metrics-section, .traffic-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  width: 100%; /* 确保子元素占满网格单元格 */
  box-sizing: border-box; /* 确保内边距不会增加宽度 */
}

.metrics-section:hover, .traffic-section:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>