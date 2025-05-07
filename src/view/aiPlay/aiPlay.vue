<template>
  <div class="chat-container" :class="{ 'minimized': isMinimized }">
    <div class="chat-layout" v-show="!isMinimized">
      <!-- 历史聊天框 -->
      <div class="history-box">
        <div class="history-header">
          <h3>历史记录</h3>
        </div>
        <div class="history-content">
          <div v-for="(history, index) in chatHistory" :key="index" class="history-item" @click="loadHistory(history)">
            <div class="history-title">{{ history.title }}</div>
            <div class="history-time">{{ history.created_at }}</div>
          </div>
        </div>
        <div class="history-footer">
          <el-button type="primary" class="new-chat-btn" @click="startNewChat">
            <el-icon><Plus /></el-icon>
            新聊天
          </el-button>
        </div>
      </div>

      <!-- 聊天记录区域 -->
      <div class="chat-box" ref="chatBox">
        <div class="chat-header">
          <h3>AI 助手</h3>
          <el-button type="text" @click="toggleMinimize">
            <el-icon><Minus /></el-icon>
          </el-button>
        </div>
        <div class="chat-content">
          <div v-for="(msg, index) in messages" :key="index" class="message">
            <img :src="msg.isUser ? userAvatar : getAIAvatar(msg.model)" alt="avatar" class="avatar"/>
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
          <div class="button-group">
            <el-button type="primary" @click="handleButton1">DEEPSEEK</el-button>
            <el-button type="primary" @click="handleButton2">通义千问</el-button>
          </div>
          <div class="input-wrapper">
            <input
                v-model="inputMessage"
                @keyup.enter="sendMessage"
                placeholder="请输入你的问题..."
                type="text"
            />
            <button @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 3D動畫容器 -->
    <div class="animation-container" v-show="isMinimized">
      <canvas ref="canvas"></canvas>
      <h2>互动</h2>
      <span>您可以长按鼠标进行互动，或点击右上角的+号返回ai聊天页面</span>
      <div class="minimize-button">
        <el-button type="text" @click="toggleMinimize">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import Loading from '@/view/advancedDetails/Loading.vue'
import userAvatar from '@/assets/user.svg'
import aiAvatar from '@/assets/deepseek.svg'
import qwenAvatar from '@/assets/qwen.svg'  // 請確保添加通義千問的頭像
import { Minus, Plus } from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import * as THREE from 'three'
import { createNoise2D } from 'simplex-noise'

const inputMessage = ref('')
const messages = ref([])
const loading = ref(false)
const chatBox = ref(null)
const isMinimized = ref(false)
const chatHistory = ref([])
const aiScen=ref(0)

/*// 用户和AI的头像URL
const userAvatar = 'https://example.com/user-avatar.png' // 替换为实际的用户头像链接
const aiAvatar = 'https://example.com/ai-avatar.png'     // 替换为实际的AI头像链接*/

// 模型頭像映射
const modelAvatars = {
  'qwen3': qwenAvatar,
  'deepseek-r1': aiAvatar
}

// 獲取AI頭像
const getAIAvatar = (model) => {
  return modelAvatars[model] || aiAvatar  // 如果沒有對應的頭像，使用默認頭像
}

// 获取历史记录
const getChatHistory = async () => {
  try {
    // TODO: 替换为实际的API调用
    const response = await axios.get('/api/ai/history')
    chatHistory.value = response.data.data || []
  } catch (error) {
    console.error('获取历史记录失败:', error)
  }
}

getChatHistory()

// 加载历史记录
const loadHistory = async (history) => {
  try {
    const response = await axios.post(`/api/ai/oneHistory`, {id: history.id})
    if (response.data.code === 0 && response.data.data.Chat) {
      // 將聊天記錄轉換為正確的格式
      const formattedMessages = []
      response.data.data.Chat.forEach(chat => {
        // 添加用戶提問
        if (chat.req) {
          formattedMessages.push({
            text: chat.req,
            isUser: true
          })
        }
        // 添加AI回答
        formattedMessages.push({
          text: chat.message.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(), // 移除思考過程
          thinking: (chat.message.match(/<think>([\s\S]*?)<\/think>/i) || [])[1]?.trim() || '', // 提取思考過程
          isUser: false,
          model: chat.model
        })
      })
      messages.value = formattedMessages
      aiScen.value = response.data.data.id
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
    ElMessage.error('加載歷史記錄失敗')
  }
}

// 按钮处理函数
const handleButton1 = async () => {
  const response = await axios.post('/api/ai/change', {message: 'deepseek-r1'})
  console.log(response.data)
  ElMessage({
    type: 'success',
    message: 'DEEPSEEK为您服务'
  })
  // TODO: 实现按钮1的功能
  console.log('按钮1被点击')
}

const handleButton2 = async () => {
  const response = await axios.post('/api/ai/change', {message: 'qwen3'})
  console.log(response.data)
  ElMessage({
    type: 'success',
    message: '通义千问为您服务'
  })
  // TODO: 实现按钮2的功能
  console.log('按钮2被点击')
}

// 3D動畫相關變量
const canvas = ref(null)
let renderer, scene, camera, splines = []
let isMouseDown = false
let prevA = 0
let mouseJump = { x: 0, y: 0 }
let offset = 0
const noise2D = createNoise2D()

// Spline類
class Spline {
  constructor(length) {
    this.geometry = new THREE.BufferGeometry()
    this.color = Math.floor(Math.random() * 80 + 180)
    
    const vertices = []
    const colors = []
    
    for (let j = 0; j < 180; j++) {
      vertices.push(j / 180 * length * 2 - length, 0, 0)
      const color = new THREE.Color(`hsl(${j * 0.6 + this.color},70%,70%)`)
      colors.push(color.r, color.g, color.b)
    }
    
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    this.material = new THREE.LineBasicMaterial({
      vertexColors: true
    })
    
    this.mesh = new THREE.Line(this.geometry, this.material)
    this.speed = (Math.random() + 0.1) * 0.0002
    scene.add(this.mesh)
  }
}

// 切换最小化状态
const toggleMinimize = async () => {
  console.log('切換前 isMinimized:', isMinimized.value)
  isMinimized.value = !isMinimized.value
  console.log('切換後 isMinimized:', isMinimized.value)
  
  if (isMinimized.value) {
    await nextTick()
    console.log('Canvas ref:', canvas.value)
    initThreeJS()
  } else {
    // 清理事件監聽器
    window.removeEventListener("resize", onResize)
    window.removeEventListener("keydown", onMouseDown)
    document.body.removeEventListener("mousedown", onMouseDown)
    document.body.removeEventListener("mouseup", onMouseUp)
    document.body.removeEventListener("touchstart", onMouseDown)
    document.body.removeEventListener("touchend", onMouseUp)
    
    // 清理渲染器
    if (renderer) {
      renderer.dispose()
      renderer = null
    }
  }
}

// 初始化3D場景
const initThreeJS = () => {
  console.log('開始初始化 Three.js')
  if (!canvas.value) {
    console.error('Canvas 元素不存在')
    return
  }

  try {
    // 清理舊的渲染器
    if (renderer) {
      console.log('清理舊的渲染器')
      renderer.dispose()
    }

    console.log('創建新的渲染器')
    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: true,
      alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
    renderer.setSize(window.innerWidth, window.innerHeight)

    console.log('創建場景')
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    
    console.log('創建相機')
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    camera.position.z = 60

    // 清理舊的splines
    console.log('清理舊的 splines')
    splines.forEach(spline => {
      if (spline.mesh) {
        scene.remove(spline.mesh)
        spline.geometry.dispose()
        spline.material.dispose()
      }
    })
    splines = []

    console.log('創建新的 splines')
    const length = 30
    for (let i = 0; i < 12; i++) {
      splines.push(new Spline(length))
    }

    // 添加事件監聽器
    console.log('添加事件監聽器')
    window.addEventListener("resize", onResize)
    window.addEventListener("keydown", onMouseDown)
    document.body.addEventListener("mousedown", onMouseDown)
    document.body.addEventListener("mouseup", onMouseUp)
    document.body.addEventListener("touchstart", onMouseDown)
    document.body.addEventListener("touchend", onMouseUp)

    // 開始渲染循環
    console.log('開始動畫循環')
    animate()
  } catch (error) {
    console.error('Three.js 初始化錯誤:', error)
  }
}

// 動畫循環
const animate = () => {
  if (!renderer || !scene || !camera) {
    console.warn('動畫循環缺少必要組件:', { renderer: !!renderer, scene: !!scene, camera: !!camera })
    return
  }
  
  requestAnimationFrame(animate)
  render(Date.now())
}

// 渲染函數
const render = (a) => {
  if (!renderer || !scene || !camera) {
    console.warn('動畫循環缺少必要組件:', { renderer: !!renderer, scene: !!scene, camera: !!camera })
    return
  }
  
  for (let i = 0; i < splines.length; i++) {
    const positions = splines[i].geometry.attributes.position.array
    const colors = splines[i].geometry.attributes.color.array
    
    for (let j = 0; j < positions.length; j += 3) {
      const x = positions[j]
      positions[j + 1] = noise2D(j * 0.05 + i - offset, a * splines[i].speed) * 8
      positions[j + 2] = noise2D(x * 0.05 + i, a * splines[i].speed) * 8
      
      positions[j + 1] *= 1 - Math.abs(x / 30)
      positions[j + 2] *= 1 - Math.abs(x / 30)
    }
    
    splines[i].geometry.attributes.position.needsUpdate = true
  }
  
  scene.rotation.x = a * 0.0003
  
  if (isMouseDown) {
    mouseJump.x += 0.001
    if (a - prevA > 100) {
      updateColor()
      prevA = a
    }
  } else {
    mouseJump.x -= 0.001
  }
  
  mouseJump.x = Math.max(0, Math.min(0.07, mouseJump.x))
  offset += mouseJump.x
  
  renderer.render(scene, camera)
}

// 更新顏色
const updateColor = () => {
  for (let i = 0; i < splines.length; i++) {
    const color = Math.abs((splines[i].color - offset * 10) % 360)
    const colors = splines[i].geometry.attributes.color.array
    
    for (let j = 0; j < colors.length; j += 3) {
      const newColor = new THREE.Color(`hsl(${j * 0.6 + color},70%,70%)`)
      colors[j] = newColor.r
      colors[j + 1] = newColor.g
      colors[j + 2] = newColor.b
    }
    
    splines[i].geometry.attributes.color.needsUpdate = true
  }
}

// 事件處理函數
const onResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const onMouseDown = (e) => {
  isMouseDown = true
  return false
}

const onMouseUp = () => {
  isMouseDown = false
}

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
    const response = await axios.post('/api/ai/chat', { message: userMsg, id: aiScen.value })

    if (response.data.code === 0) {
      let botReply = response.data.data.message || '暂无回复'

      // 提取思考过程
      const thinkingMatch = botReply.match(/<think>([\s\S]*?)<\/think>/i)
      const thinkingContent = thinkingMatch ? thinkingMatch[1].trim() : ''

      // 去除原字符串中的 <思考过程> 部分
      botReply = botReply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

      // 推送 AI 回复，包含思考过程字段
      messages.value.push({
        text: formatMessage(botReply),
        thinking: formatMessage(thinkingContent),
        isUser: false,
        model: response.data.data.model
      })

      // 更新場景ID
      if (response.data.data.id) {
        aiScen.value = response.data.data.id
      }

      scrollToBottom()
    } else {
      ElMessage.error(response.data.msg || '請求失敗')
    }
  } catch (error) {
    console.error('请求失败:', error)
    messages.value.push({ text: '抱歉，服务器出错了，请稍后再试。', isUser: false })
    ElMessage.error('請求失敗，請稍後再試')
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

// 开始新聊天
const startNewChat = () => {
  aiScen.value=0
  messages.value = []
  inputMessage.value = ''
}

// 組件掛載和卸載
onMounted(() => {
  console.log('組件掛載，Canvas ref:', canvas.value)
  if (isMinimized.value) {
    initThreeJS()
  }
})

onUnmounted(() => {
  console.log('組件卸載，清理事件監聽器')
  window.removeEventListener("resize", onResize)
  window.removeEventListener("keydown", onMouseDown)
  document.body.removeEventListener("mousedown", onMouseDown)
  document.body.removeEventListener("mouseup", onMouseUp)
  document.body.removeEventListener("touchstart", onMouseDown)
  document.body.removeEventListener("touchend", onMouseUp)
  
  if (renderer) {
    renderer.dispose()
  }
})

</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 85vh;
  max-width: 1200px;
  margin: 30px auto;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  font-family: "Segoe UI", sans-serif;
  position: relative;
  transition: all 0.3s ease;
}

.chat-container.minimized {
  background: #000;
}

.chat-layout {
  display: flex;
  height: 100%;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #f7f9fc;
}

.chat-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f7f9fc;
}

.history-box {
  width: 300px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid #ddd;
}

.history-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  background-color: #f7f9fc;
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.history-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history-item:hover {
  background-color: #f7f9fc;
}

.history-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.history-time {
  font-size: 12px;
  color: #999;
}

.history-footer {
  padding: 15px;
  border-top: 1px solid #ddd;
  background-color: #f7f9fc;
  text-align: center;
}

.new-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button-group {
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  background-color: #f7f9fc;
}

.input-wrapper {
  display: flex;
  padding: 15px;
  background-color: #f7f9fc;
}

.input-wrapper input {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #ced4da;
  border-radius: 8px 0 0 8px;
  outline: none;
}

.input-wrapper button {
  padding: 12px 24px;
  font-size: 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  transition: background 0.3s ease;
}

.input-wrapper button:hover {
  background-color: #369c6b;
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

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
}

.animation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.animation-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 1001;
}

.animation-container h2 {
  position: absolute;
  bottom: 80px;
  width: 100%;
  text-align: center;
  color: white;
  font-family: 'Josefin Sans', sans-serif;
  letter-spacing: 4px;
  opacity: 0.5;
  font-weight: 300;
  z-index: 1002;
}

.animation-container span {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 14px;
  opacity: 0.4;
  z-index: 1002;
  padding: 0 20px;
  line-height: 1.5;
}

body {
  overflow: hidden;
  margin: 0;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.minimize-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1002;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 12px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.minimize-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.minimize-button .el-button {
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.minimize-button .el-icon {
  color: white;
  font-size: 28px;
  transition: transform 0.3s ease;
}

.minimize-button:hover .el-icon {
  transform: rotate(90deg);
}
</style>