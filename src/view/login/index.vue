<template>
  <div id="userLayout" class="w-full h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-6xl h-[80vh] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg">
      <!-- 左侧表单区域 -->
      <div class="w-full md:w-1/2 p-4 md:p-10 flex-grow flex flex-col justify-center space-y-4 md:space-y-6 glass-panel">
        <div class="mb-4 md:mb-8">
        </div>

        <div>
<!--          <img :src=$GIN_VUE_ADMIN.appLogo alt>-->
          <!--              {{ $GIN_VUE_ADMIN.appName }}-->
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
          <el-form-item prop="username" class="mb-6">
            <el-input
                v-model="loginFormData.username"
                size="large"
                placeholder="用户名"
                prefix-icon="user"
                class="input-glass"
            />
          </el-form-item>
          <el-form-item prop="password" class="mb-8">
            <el-input
                v-model="loginFormData.password"
                type="password"
                show-password
                size="large"
                placeholder="密码"
                prefix-icon="lock"
                class="input-glass"
            />
          </el-form-item>
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
              登录系统
            </el-button>

            <!--              <el-button
                              type="primary"
                              size="large"
                              class="w-full !h-12 shadow-lg hover:shadow-xl transition-all"
                              @click="submitForm"
                          >
                            登录系统
                          </el-button>-->


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
        </el-form>
      </div>

      <!-- 右侧图片区域 -->
      <div class="hidden md:block w-1/2 relative">
        <img src="@/assets/loginright.png" alt="banner" class="w-full h-full object-cover"/>
      </div>
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
</script>


<style scoped>
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

.glass-panel {
  background: linear-gradient(135deg, #ffffff, #fff8e1); /* 白色 → 浅黄色渐变 */
  backdrop-filter: blur(12px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(12px); /* Safari 兼容 */
  border-radius: 1.5rem; /* 与父容器一致的圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* 微弱阴影增强质感 */
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* 可选：增加一点装饰性光晕或内发光 */
.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 1.5rem;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 40%);
  z-index: 0;
}

/* 表单内容层级提升 */
.glass-panel > * {
  position: relative;
  z-index: 1;
}

/* 全局背景设置 */
#userLayout {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),
  url("@/assets/loginback.png") no-repeat center center fixed; /* 替换为您自己的背景图片路径 */
  background-size: cover;
  position: relative;
  overflow: hidden;
}


@keyframes moveGradient {
  0% { transform: translate(-50%, -50%) rotate(45deg); }
  100% { transform: translate(-150%, -150%) rotate(45deg); }
}

.glass-panel {
  background: linear-gradient(135deg, #ffffff, #fff8e1); /* 白色 → 浅黄色渐变 */
  backdrop-filter: blur(12px); /* 毛玻璃效果 */
  -webkit-backdrop-filter: blur(12px); /* Safari 兼容 */
  /* 修改：仅左上和左下角有圆角 */
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* 微弱阴影增强质感 */
  padding: 2rem;
  position: relative;
  z-index: 1; /* 确保位于背景之上 */
}

/* 新增：为IOT标题和下方介绍预留空间并居中 */
.glass-panel > div:first-child {
  margin-top: 6rem; /* 预留logo的空间 */
  text-align: center;
}

/* 修改或新增：确保IOT及其描述居中 */
.glass-panel h2, .glass-panel p {
  text-align: center;
}

/* 可选：增加一点装饰性光晕或内发光 */
.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* 修改：与新的圆角相匹配 */
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 40%);
  z-index: 0;
}

/* 可选：增加一点装饰性光晕或内发光 */
.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 1.5rem;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent 40%);
  z-index: 0;
}

/* 表单内容层级提升 */
.glass-panel > * {
  position: relative;
  z-index: 1;
}
</style>