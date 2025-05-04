
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="驱动名称:" prop="driver_name">
    <el-input v-model="formData.driver_name" :clearable="true" placeholder="请输入驱动名称" />
</el-form-item>
        <el-form-item label="驱动类型:" prop="driver_type">
    <el-select v-model="formData.driver_type" placeholder="请选择驱动类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in drive_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="镜像编号:" prop="mirror_number">
    <el-input v-model="formData.mirror_number" :clearable="true" placeholder="请输入镜像编号" />
</el-form-item>
        <el-form-item label="协议:" prop="agreement">
    <el-select v-model="formData.agreement" placeholder="请选择协议" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in gatewayProtocolOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="镜像仓库地址:" prop="mirror_address">
    <el-input v-model="formData.mirror_address" :clearable="true" placeholder="请输入镜像仓库地址" />
</el-form-item>
        <el-form-item label="驱动标识:" prop="driver_identification">
    <el-input v-model="formData.driver_identification" :clearable="true" placeholder="请输入驱动标识" />
</el-form-item>
        <el-form-item label="版本:" prop="version">
    <el-input v-model="formData.version" :clearable="true" placeholder="请输入版本" />
</el-form-item>
        <el-form-item label="描述:" prop="description">
    <RichEdit v-model="formData.description"/>
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
  createDrivers,
  updateDrivers,
  findDrivers
} from '@/api/driverPkg/drivers'

defineOptions({
    name: 'DriversForm'
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
const drive_typeOptions = ref([])
const gatewayProtocolOptions = ref([])
const formData = ref({
            driver_name: '',
            driver_type: '',
            mirror_number: '',
            agreement: '',
            mirror_address: '',
            driver_identification: '',
            version: '',
            description: '',
        })
// 验证规则
const rule = reactive({
               driver_name : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               agreement : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               mirror_address : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               driver_identification : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               version : [{
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
      const res = await findDrivers({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    drive_typeOptions.value = await getDictFunc('drive_type')
    gatewayProtocolOptions.value = await getDictFunc('gatewayProtocol')
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
               res = await createDrivers(formData.value)
               break
             case 'update':
               res = await updateDrivers(formData.value)
               break
             default:
               res = await createDrivers(formData.value)
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
