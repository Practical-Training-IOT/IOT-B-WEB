<template>
  <div class="chat-container">
    <!-- 聊天记录区域 -->
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <img :src="msg.isUser ? userAvatar : aiAvatar" alt="avatar" class="avatar"/>
        <div :class="['bubble', msg.isUser ? 'user-bubble' : 'bot-bubble']">
          <!-- 用户消息或AI回答 -->
          <div v-if="!msg.isUser && msg.thinking" class="thinking-process" v-html="msg.thinking"></div>
          <div v-html="msg.text"></div>
        </div>
      </div>

      <!-- 加载动画 -->
      <Loading v-if="loading" />
    </div>

    <!-- 输入框 -->
    <div class="input-box">
      <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="请输入你的问题..."
          type="text"
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Loading from '@/view/advancedDetails/Loading.vue'
import userAvatar from '@/assets/user.svg'
import aiAvatar from '@/assets/deepseek.svg'

const inputMessage = ref('')
const messages = ref([])
const loading = ref(false)
const chatBox = ref(null)

/*// 用户和AI的头像URL
const userAvatar = 'https://example.com/user-avatar.png' // 替换为实际的用户头像链接
const aiAvatar = 'https://example.com/ai-avatar.png'     // 替换为实际的AI头像链接*/

// 模拟发送请求给DeepSeek接口
const sendMessage = async () => {
  const userMsg = inputMessage.value.trim()
  if (!userMsg) return

  // 添加用户消息
  messages.value.push({ text: userMsg, isUser: true })
  inputMessage.value = ''
  scrollToBottom()

  // 开始加载
  loading.value = true

  try {
    // 发送请求给DeepSeek接口
    const response = await axios.post('/api/ai/chat', { message: userMsg })

    let botReply = response.data.data || '暂无回复'

    // 提取思考过程
    const thinkingMatch = botReply.match(/<思考过程>([\s\S]*?)<\/思考过程>/i)
    const thinkingContent = thinkingMatch ? thinkingMatch[1].trim() : ''

    // 去除原字符串中的 <思考过程> 部分
    botReply = botReply.replace(/<思考过程>[\s\S]*?<\/思考过程>/gi, '').trim()

    // 推送 AI 回复，包含思考过程字段
    messages.value.push({
      text: formatMessage(botReply),
      thinking: formatMessage(thinkingContent),
      isUser: false
    })

    scrollToBottom()
  } catch (error) {
    console.error('请求失败:', error)
    messages.value.push({ text: '抱歉，服务器出错了，请稍后再试。', isUser: false })
  } finally {
    loading.value = false
  }
}

// 自动滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  }, 100)
}

// 支持基本的 Markdown 格式渲染
const formatMessage = (text) => {
  if (!text) return ''
  return text
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
}

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 85vh;
  max-width: 900px;
  margin: 30px auto;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  font-family: "Segoe UI", sans-serif;
}

.chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  border-bottom: 1px solid #ddd;
  background-color: #f7f9fc;
}

.message {
  display: flex;
  align-items: start;
  margin-bottom: 20px;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 12px;
}

.bubble {
  max-width: 75%;
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  word-wrap: break-word;
}

.user-bubble {
  background-color: #42b983;
  color: white;
  align-self: flex-end;
  border-radius: 18px 4px 18px 18px;
}

.bot-bubble {
  background-color: #e9ecef;
  color: #333;
  align-self: flex-start;
  border-radius: 4px 18px 18px 18px;
}

.thinking-process {
  background-color: #f1f3f5;
  border-left: 4px solid #42b983;
  padding: 10px 15px;
  margin-top: 10px;
  font-style: italic;
  font-size: 13px;
  color: #555;
}

.input-box {
  display: flex;
  padding: 15px;
  background-color: #f7f9fc;
}

.input-box input {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-radius: 8px 0 0 8px;
  outline: none;
}

.input-box button {
  padding: 12px 24px;
  font-size: 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  transition: background 0.3s ease;
}

.input-box button:hover {
  background-color: #369c6b;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}
</style>