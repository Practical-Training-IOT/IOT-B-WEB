
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="规则名称:" prop="name">
    <el-input v-model="formData.name" :clearable="true" placeholder="请输入规则名称" />
</el-form-item>
        <el-form-item label="触发类型：设备数据、设备状态等:" prop="triggerType">
    <el-select v-model="formData.triggerType" placeholder="请选择触发类型：设备数据、设备状态等" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in trigger_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="触发条件，JSON格式:" prop="triggerCondition">
    <RichEdit v-model="formData.triggerCondition"/>
</el-form-item>
        <el-form-item label="动作类型：通知、设备控制等:" prop="actionType">
    <el-select v-model="formData.actionType" placeholder="请选择动作类型：通知、设备控制等" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in action_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="动作配置，JSON格式:" prop="actionConfig">
    <RichEdit v-model="formData.actionConfig"/>
</el-form-item>
        <el-form-item label="规则状态：启用、禁用:" prop="status">
    <el-select v-model="formData.status" placeholder="请选择规则状态：启用、禁用" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in Rule statusOptions" :key="key" :label="item.label" :value="item.value" />
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
  createAlertRules,
  updateAlertRules,
  findAlertRules
} from '@/api/alertRulePkg/alertRules'

defineOptions({
    name: 'AlertRulesForm'
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
const RulestatusOptions = ref([])
const trigger_typeOptions = ref([])
const action_typeOptions = ref([])
const formData = ref({
            name: '',
            triggerType: '',
            triggerCondition: '',
            actionType: '',
            actionConfig: '',
            status: '',
        })
// 验证规则
const rule = reactive({
               name : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               triggerType : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               triggerCondition : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               actionType : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               actionConfig : [{
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
      const res = await findAlertRules({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    Rule statusOptions.value = await getDictFunc('Rule status')
    trigger_typeOptions.value = await getDictFunc('trigger_type')
    action_typeOptions.value = await getDictFunc('action_type')
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
               res = await createAlertRules(formData.value)
               break
             case 'update':
               res = await updateAlertRules(formData.value)
               break
             default:
               res = await createAlertRules(formData.value)
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
