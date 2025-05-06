<template>
  <div class="loading">
    <span class="dot">.</span>
    <span class="dot">.</span>
    <span class="dot">.</span>
  </div>
</template>

<script setup></script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 16px;
  color: #666;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: #42b983;
  border-radius: 50%;
  animation: blink 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
</style>