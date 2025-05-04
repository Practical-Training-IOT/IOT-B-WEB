
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="告警名称:" prop="name">
    <el-input v-model="formData.name" :clearable="true" placeholder="请输入告警名称" />
</el-form-item>
        <el-form-item label="设备ID:" prop="deviceId">
    <el-input v-model.number="formData.deviceId" :clearable="true" placeholder="请输入设备ID" />
</el-form-item>
        <el-form-item label="告警级别:" prop="alertLevel">
    <el-select v-model="formData.alertLevel" placeholder="请选择告警级别" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in alert_levelOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="告警类型:" prop="alertType">
    <el-select v-model="formData.alertType" placeholder="请选择告警类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in alert_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="告警内容:" prop="alertContent">
    <el-input v-model="formData.alertContent" :clearable="true" placeholder="请输入告警内容" />
</el-form-item>
        <el-form-item label="告警状态:" prop="status">
    <el-select v-model="formData.status" placeholder="请选择告警状态" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in AlarmstatusOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item>
          <el-button :loading="btnLoading" type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {
  createAlerts,
  updateAlerts,
  findAlerts
} from '@/api/alertRecordPkg/alerts'

defineOptions({
    name: 'AlertsForm'
})

// 自动获取字典
import { getDictFunc } from '@/utils/format'
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'


const route = useRoute()
const router = useRouter()

// 提交按钮loading
const btnLoading = ref(false)

const type = ref('')
const alert_levelOptions = ref([])
const alert_typeOptions = ref([])
const AlarmstatusOptions = ref([])
const formData = ref({
            name: '',
            deviceId: undefined,
            alertLevel: '',
            alertType: '',
            alertContent: '',
            status: '',
        })
// 验证规则
const rule = reactive({
               name : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               alertLevel : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               alertType : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               status : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
})

const elFormRef = ref()

// 初始化方法
const init = async () => {
 // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
    if (route.query.id) {
      const res = await findAlerts({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    alert_levelOptions.value = await getDictFunc('alert_level')
    alert_typeOptions.value = await getDictFunc('alert_type')
    AlarmstatusOptions.value = await getDictFunc('Alarmstatus')
}

init()
// 保存按钮
const save = async() => {
      btnLoading.value = true
      elFormRef.value?.validate( async (valid) => {
         if (!valid) return btnLoading.value = false
            let res
           switch (type.value) {
             case 'create':
               res = await createAlerts(formData.value)
               break
             case 'update':
               res = await updateAlerts(formData.value)
               break
             default:
               res = await createAlerts(formData.value)
               break
           }
           btnLoading.value = false
           if (res.code === 0) {
             ElMessage({
               type: 'success',
               message: '创建/更改成功'
             })
           }
       })
}

// 返回按钮
const back = () => {
    router.go(-1)
}

</script>

<style>
</style>
