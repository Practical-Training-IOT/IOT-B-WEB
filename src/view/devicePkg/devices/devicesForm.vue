
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="产品范围:" prop="product_range">
    <el-select v-model="formData.product_range" placeholder="请选择产品范围" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in productRangeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="平台:" prop="platform">
    <el-select v-model="formData.platform" placeholder="请选择平台" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in platformTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="驱动:" prop="drive">
    <el-select v-model="formData.drive" placeholder="请选择驱动" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in driveOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="状态:" prop="status">
    <el-select v-model="formData.status" placeholder="请选择状态" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in driveStatusOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="设备添加方式:" prop="add_device_method">
    <el-select v-model="formData.add_device_method" placeholder="请选择设备添加方式" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in addDeviceMethodOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="设备名称:" prop="drive_name">
    <el-input v-model="formData.drive_name" :clearable="true" placeholder="请输入设备名称" />
</el-form-item>
        <el-form-item label="所属产品:" prop="belonging_products">
    <el-input v-model="formData.belonging_products" :clearable="true" placeholder="请输入所属产品" />
</el-form-item>
        <el-form-item label="关联驱动:" prop="association_driven">
    <el-input v-model="formData.association_driven" :clearable="true" placeholder="请输入关联驱动" />
</el-form-item>
        <el-form-item label="设备描述:" prop="device_description">
    <RichEdit v-model="formData.device_description"/>
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
  createDevices,
  updateDevices,
  findDevices
} from '@/api/devicePkg/devices'

defineOptions({
    name: 'DevicesForm'
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
const addDeviceMethodOptions = ref([])
const platformTypeOptions = ref([])
const driveStatusOptions = ref([])
const productRangeOptions = ref([])
const driveOptions = ref([])
const formData = ref({
            product_range: '',
            platform: '',
            drive: '',
            status: '',
            add_device_method: '',
            drive_name: '',
            belonging_products: '',
            association_driven: '',
            device_description: '',
        })
// 验证规则
const rule = reactive({
               add_device_method : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               drive_name : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               belonging_products : [{
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
      const res = await findDevices({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    addDeviceMethodOptions.value = await getDictFunc('addDeviceMethod')
    platformTypeOptions.value = await getDictFunc('platformType')
    driveStatusOptions.value = await getDictFunc('driveStatus')
    productRangeOptions.value = await getDictFunc('productRange')
    driveOptions.value = await getDictFunc('drive')
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
               res = await createDevices(formData.value)
               break
             case 'update':
               res = await updateDevices(formData.value)
               break
             default:
               res = await createDevices(formData.value)
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
