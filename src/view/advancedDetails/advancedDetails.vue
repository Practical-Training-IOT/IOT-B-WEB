<template>
  <div>
    <div class="container">
      <div v-for="(card, index) in cards" :key="index" class="card">
        <div class="icon">
          <img :src="card.icon" :alt="card.title + ' icon'" />
        </div>
        <h1 class="card-title">{{ card.title }}</h1>
        <p class="card-description">{{ card.description }}</p>
        <span class="card-link"><router-link :to=card.hr>前往</router-link></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import res from '@/assets/resource.svg'
import rule from '@/assets/rule.svg'
import scen from '@/assets/scene.svg'
import ai from '@/assets/ai.svg'

defineOptions({
  name: 'advancedDetails'
});

const cards = ref([
  {
    icon: res,
    title: '资源管理',
    description: '平台提供多种消息通信中间件资源，资源可作为规则引擎的消息目的地，通过创建资源快速将数据推送至应用平台。',
    hr: '/layout/seniorManagement/resources'
  },
  {
    icon: rule,
    title: '规则引擎',
    description: '规则引擎提供数据流转能力，可对接入平台的设备数据进行过滤转换，并将数据推送至用户指定的消息目的地。规则引擎流转规则需要配置消息源（推送消息类型）、条件过滤规则及消息目的地（推送方式）。',
    hr: '/layout/seniorManagement/ruleInfo'
  },
  {
    icon: scen,
    title: '场景联动',
    description: '场景联动是一种开发自动化业务逻辑的编程方式，目前支持设备、时间条件触发，您可以自定义设备之间的联动规则，系统执行自定义的业务逻辑，满足多场景联动需求。',
    hr: '/layout/seniorManagement/scenes'
  },
  {
    icon: ai,
    title: 'AI互动',
    description: 'AI互动是一种集成了多种ai的功能，目前支持deepseek、通义千问，您可以自由聊天，满足多种需求。',
    hr: '/layout/seniorManagement/aiPlay'
  }
]);

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: all 0.6s ease;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100svh;
  background-size: cover;
  background-position: center center;
  text-align: center;
  background-image: url("@/assets/star.svg");
}

.container {
  position: relative;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 40px;
  user-select: none;
  margin-top: 10vh;
}

.card {
  position: relative;
  width: 300px;
  margin: 25px;
  padding: 40px;
  border-radius: 15px;
  color: #ffffff;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 20px 20px 22px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-25px);
}

.card .icon {
  width: 40%;
  margin-bottom: 20px;
}

.card .icon i {
  font-size: 70px;
  color: #ffffff;
}

.card:hover .icon i {
  transform: rotate(360deg);
}

.card-title {
  margin-bottom: 10px;
  font-size: 50px;
}

.card-link {
  text-decoration: none;
  display: inline-block;
  border: 2px solid #ffffff;
  color: #ffffff;
  padding: 10px 30px;
  margin-top: 20px;
  border-radius: 50px;
}

.card-link:hover {
  background: #ffffff;
  color: #262626;
}

@media screen and (max-width: 800px) {
  .card:hover {
    transform: translateY(-5px);
  }
}
</style>