
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="规则名称:" prop="ruleName">
    <el-input v-model="formData.ruleName" :clearable="true" placeholder="请输入规则名称" />
</el-form-item>
        <el-form-item label="告警类型:" prop="alarmType">
    <el-select v-model="formData.alarmType" placeholder="请选择告警类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in alert_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="告警级别:" prop="alarmLevel">
    <el-select v-model="formData.alarmLevel" placeholder="请选择告警级别" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in alert_levelOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="规则描述:" prop="ruleDescription">
    <RichEdit v-model="formData.ruleDescription"/>
</el-form-item>
        <el-form-item label="触发方式:" prop="triggerMode">
    <el-select v-model="formData.triggerMode" placeholder="请选择触发方式" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in trigger_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="取值类型:" prop="valueType">
    <el-select v-model="formData.valueType" placeholder="请选择取值类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in value_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="取值周期:" prop="valuePeriod">
    <el-select v-model="formData.valuePeriod" placeholder="请选择取值周期" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in value_periodOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="判断条件:" prop="judgingCondition">
    <el-select v-model="formData.judgingCondition" placeholder="请选择判断条件" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in judging_conditionOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="取值:" prop="value">
    <el-input v-model="formData.value" :clearable="true" placeholder="请输入取值" />
</el-form-item>
        <el-form-item label="静默时间:" prop="silencePeriod">
    <el-select v-model="formData.silencePeriod" placeholder="请选择静默时间" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in silence_periodOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="通知方式:" prop="meanNotification">
    <el-select v-model="formData.meanNotification" placeholder="请选择通知方式" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in mean_notificationOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="状态:" prop="status">
    <el-select v-model="formData.status" placeholder="请选择状态" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in Rule_statusOptions" :key="key" :label="item.label" :value="item.value" />
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
  createAlarms,
  updateAlarms,
  findAlarms
} from '@/api/alertRulePkg/alarms'

defineOptions({
    name: 'AlarmsForm'
})

// 自动获取字典
import { getDictFunc } from '@/utils/format'
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
// 富文本组件
import RichEdit from '@/components/richtext/rich-edit.vue'


const route = useRoute()
const router = useRouter()

// 提交按钮loading
const btnLoading = ref(false)

const type = ref('')
const judging_conditionOptions = ref([])
const mean_notificationOptions = ref([])
const alert_typeOptions = ref([])
const silence_periodOptions = ref([])
const Rule_statusOptions = ref([])
const alert_levelOptions = ref([])
const trigger_typeOptions = ref([])
const value_typeOptions = ref([])
const value_periodOptions = ref([])
const formData = ref({
            ruleName: '',
            alarmType: '',
            alarmLevel: '',
            ruleDescription: '',
            triggerMode: '',
            valueType: '',
            valuePeriod: '',
            judgingCondition: '',
            value: '',
            silencePeriod: '',
            meanNotification: '',
            status: '',
        })
// 验证规则
const rule = reactive({
               ruleName : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               alarmType : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               alarmLevel : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               triggerMode : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               valueType : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               valuePeriod : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               judgingCondition : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               value : [{
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
      const res = await findAlarms({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    judging_conditionOptions.value = await getDictFunc('judging_condition')
    mean_notificationOptions.value = await getDictFunc('mean_notification')
    alert_typeOptions.value = await getDictFunc('alert_type')
    silence_periodOptions.value = await getDictFunc('silence_period')
    Rule_statusOptions.value = await getDictFunc('Rule_status')
    alert_levelOptions.value = await getDictFunc('alert_level')
    trigger_typeOptions.value = await getDictFunc('trigger_type')
    value_typeOptions.value = await getDictFunc('value_type')
    value_periodOptions.value = await getDictFunc('value_period')
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
               res = await createAlarms(formData.value)
               break
             case 'update':
               res = await updateAlarms(formData.value)
               break
             default:
               res = await createAlarms(formData.value)
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
