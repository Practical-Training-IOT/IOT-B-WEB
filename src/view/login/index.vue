<template>
  <div id="userLayout" class="w-full h-screen flex items-center justify-center bg-cover bg-center custom-bg relative overflow-hidden" style="background-image: url('src/assets/loginback.png');">
    <!-- Canvas 背景 -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full z-0"></canvas>
    <!-- 左侧表单区域 -->
    <div class="w-full max-w-6xl h-[80vh] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg relative">
      <div class="w-full md:w-1/2 p-4 md:p-10 flex-grow glass-panel flex flex-col justify-center space-y-4 md:space-y-6" :class="{ 'hidden': isFormHidden }">
        <div class="mb-4 md:mb-8 text-center">
          <img
              class="w-24 mx-auto mb-6"
              :src="$GIN_VUE_ADMIN.appLogo"
              alt="logo"
          />
          <h2 class="text-xl md:text-2xl font-bold">{{ $GIN_VUE_ADMIN.appName }}</h2>
        </div>

        <el-form
            ref="loginForm"
            :model="loginFormData"
            :rules="rules"
            @keyup.enter="submitForm"
        >
          <!-- 用户名输入框 -->
          <el-form-item prop="username" class="mb-6">
            <el-input
                v-model="loginFormData.username"
                size="large"
                placeholder="邮箱账户或手机号"
                prefix-icon="user"
                class="input-glass"
            />
          </el-form-item>

          <!-- 密码输入框 -->
          <el-form-item prop="password" class="mb-8">
            <el-input
                v-model="loginFormData.password"
                type="password"
                show-password
                size="large"
                placeholder="请输入密码"
                prefix-icon="lock"
                class="input-glass"
            />
          </el-form-item>

          <!-- 验证码输入框（如有） -->
          <el-form-item v-if="loginFormData.openCaptcha" prop="captcha" class="mb-6">
            <div class="flex gap-4">
              <el-input
                  v-model="loginFormData.captcha"
                  placeholder="验证码"
                  size="large"
                  class="flex-1"
              />
              <div class="captcha-image cursor-pointer" @click="loginVerify">
                <img v-if="picPath" :src="picPath" class="h-12 rounded" />
              </div>
            </div>
          </el-form-item>

          <el-form-item class="mb-6">
            <el-button
                type="primary"
                size="large"
                class="custom-wave-button w-full !h-12 shadow-lg hover:shadow-xl"
                @click="submitForm"
            >
              开始使用
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
                class="w-full !h-12 bg-gradient-to-r from-blue-100 to-purple-100
                       hover:from-blue-200 hover:to-purple-200 transition-all begin"
                @click="checkInit"
            >
              首次使用？前往初始化
            </el-button>
          </el-form-item>

          <!-- 新增：缩小按钮 -->
          <el-button
              type="default"
              size="large"
              class="w-full !h-12 mt-4"
              @click="toggleFormVisibility"
          >
            {{ isFormHidden ? '展开表单' : '收起表单' }}
          </el-button>
        </el-form>
      </div>

      <!-- 右侧图片区域 -->
      <div class="hidden md:block w-1/2 relative" :class="{ 'hidden': isFormHidden }" v-if="isFormHidden===false">
        <img src="@/assets/loginright.png" alt="banner" class="w-full h-full object-cover"/>
      </div>

      <!-- 浮动按钮 -->
      <el-button
          v-if="isFormHidden"
          type="primary"
          circle
          class="fab-button absolute bottom-10 right-10 z-10"
          @click="toggleFormVisibility"
      >
        +
      </el-button>
    </div>
  </div>
  <BottomInfo class="left-0 right-0 absolute bottom-3 mx-auto w-full z-20">
  </BottomInfo>
</template>


<script setup>
  import { captcha } from '@/api/user'
  import { checkDB } from '@/api/initdb'
  import BottomInfo from '@/components/bottomInfo/bottomInfo.vue'
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/pinia/modules/user'

  defineOptions({
    name: 'Login'
  })

  const router = useRouter()
  // 验证函数
  const checkUsername = (rule, value, callback) => {
    if (value.length < 5) {
      return callback(new Error('请输入正确的用户名'))
    } else {
      callback()
    }
  }
  const checkPassword = (rule, value, callback) => {
    if (value.length < 6) {
      return callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  }

  // 获取验证码
  const loginVerify = async () => {
    const ele = await captcha()
    rules.captcha.push({
      max: ele.data.captchaLength,
      min: ele.data.captchaLength,
      message: `请输入${ele.data.captchaLength}位验证码`,
      trigger: 'blur'
    })
    picPath.value = ele.data.picPath
    loginFormData.captchaId = ele.data.captchaId
    loginFormData.openCaptcha = ele.data.openCaptcha
  }
  loginVerify()

  // 登录相关操作
  const loginForm = ref(null)
  const picPath = ref('')
  const loginFormData = reactive({
    username: 'admin',
    password: '',
    captcha: '',
    captchaId: '',
    openCaptcha: false
  })
  const rules = reactive({
    username: [{ validator: checkUsername, trigger: 'blur' }],
    password: [{ validator: checkPassword, trigger: 'blur' }],
    captcha: [
      {
        message: '验证码格式不正确',
        trigger: 'blur'
      }
    ]
  })

  const isFormHidden = ref(false)

  function toggleFormVisibility() {
    isFormHidden.value = !isFormHidden.value
  }

  const userStore = useUserStore()
  const login = async () => {
    return await userStore.LoginIn(loginFormData)
  }
  const submitForm = () => {
    loginForm.value.validate(async (v) => {
      if (!v) {
        // 未通过前端静态验证
        ElMessage({
          type: 'error',
          message: '请正确填写登录信息',
          showClose: true
        })
        await loginVerify()
        return false
      }

      // 通过验证，请求登陆
      const flag = await login()

      // 登陆失败，刷新验证码
      if (!flag) {
        await loginVerify()
        return false
      }

      // 登陆成功
      return true
    })
  }

  // 跳转初始化
  const checkInit = async () => {
    const res = await checkDB()
    if (res.code === 0) {
      if (res.data?.needInit) {
        userStore.NeedInit()
        await router.push({ name: 'Init' })
      } else {
        ElMessage({
          type: 'info',
          message: '已配置数据库信息，无法初始化'
        })
      }
    }
  }

  import { onMounted } from 'vue'

  const canvasRef = ref(null)

  onMounted(() => {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    let width, height
    let stars = []
    const STAR_COUNT = 300
    let speed = 1
    let mouseX = 0, mouseY = 0

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    function initStars() {
      stars = []
      for (let i = 0; i < STAR_COUNT; i++) {
        let x = Math.random() * width * 2 - width
        let y = Math.random() * height * 2 - height
        let z = Math.random() * width + 800 // 增加初始Z值避免太靠近屏幕
        stars.push({ x, y, z })
      }
    }

    function project(x, y, z) {
      const scale = width / 2 / (z + width)
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        r: Math.max(0.5, 3 - z / 200), // 调整星星大小
        alpha: Math.min(1, 0.7 + z / 1600) // 调整透明度
      }
    }

    function handleMouseMove(event) {
      mouseX = (event.clientX - width / 2) / width
      mouseY = (event.clientY - height / 2) / height
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)'
      ctx.fillRect(0, 0, width, height)

      for (let star of stars) {
        star.z -= speed * 2
        if (star.z <= 0) {
          star.z += width
        }

        const perspectiveX = star.x + mouseX * star.z * 0.05
        const perspectiveY = star.y + mouseY * star.z * 0.05

        const p = project(perspectiveX, perspectiveY, star.z)

        if (p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
          ctx.fill()

          // 随机添加拖尾效果
          if (Math.random() > 0.9) {
            const tp = project(perspectiveX, perspectiveY, star.z + Math.random() * 5)
            ctx.beginPath()
            ctx.arc(tp.x, tp.y, tp.r * 0.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.3})`
            ctx.fill()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    // 初始化
    resize()
    initStars()
    animate()

    // 鼠标监听
    window.addEventListener('mousemove', handleMouseMove)

    // 滚轮控制速度
    window.addEventListener('wheel', e => {
      speed += e.deltaY * -0.0005
      speed = Math.max(0.1, Math.min(10, speed))
    })

    // 自适应窗口
    window.addEventListener('resize', () => {
      resize()
      initStars()
    })
  })

</script>

<style scoped>
#userLayout {
  background-size: cover;
  position: relative;
  overflow: hidden;
}
.glass-panel {
  background: linear-gradient(135deg, #ffffff, #fff8e1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 40%);
  z-index: 0;
}

.glass-panel > * {
  position: relative;
  z-index: 1;
}

:deep(.input-style) {
  --el-input-border-color: transparent;
  --el-input-bg-color: rgba(0, 0, 0, 0.05);
  --el-input-hover-border-color: rgba(0, 0, 0, 0.1);
  --el-input-focus-border-color: rgba(0, 0, 0, 0.15);
}

:deep(.el-input__inner) {
  background-color: var(--el-input-bg-color);
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
}

:deep(.el-button) {
  border-radius: 8px;
}

:deep(.el-button:hover) {
  opacity: 0.9;
}

#userLayout {
  background-size: cover;
  position: relative;
  overflow: hidden;
}

canvas {
  filter: blur(0.5px);
}

.fab-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
  background-color: #409EFF;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden {
  display: none;
}

canvas {
  background: radial-gradient(circle, rgba(10, 10, 20, 1) 0%, rgba(0, 0, 10, 1) 100%);
}
</style>