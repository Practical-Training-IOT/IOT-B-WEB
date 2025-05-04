
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="驱动名称:" prop="driverName">
    <el-input v-model="formData.driverName" :clearable="true" placeholder="请输入驱动名称" />
</el-form-item>
        <el-form-item label="驱动类型:" prop="driverType">
    <el-select v-model="formData.driverType" placeholder="请选择驱动类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in drive_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="镜像编号:" prop="mirrorNumber">
    <el-input v-model="formData.mirrorNumber" :clearable="true" placeholder="请输入镜像编号" />
</el-form-item>
        <el-form-item label="协议:" prop="agreement">
    <el-select v-model="formData.agreement" placeholder="请选择协议" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in AgreementTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="驱动镜像地址:" prop="mirrorAddress">
    <el-input v-model="formData.mirrorAddress" :clearable="true" placeholder="请输入驱动镜像地址" />
</el-form-item>
        <el-form-item label="驱动标识:" prop="driverIdentification">
    <el-input v-model="formData.driverIdentification" :clearable="true" placeholder="请输入驱动标识" />
</el-form-item>
        <el-form-item label="版本:" prop="version">
    <el-input v-model="formData.version" :clearable="true" placeholder="请输入版本" />
</el-form-item>
        <el-form-item label="描述:" prop="description">
    <el-input v-model="formData.description" :clearable="true" placeholder="请输入描述" />
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
  createMyDrivers,
  updateMyDrivers,
  findMyDrivers
} from '@/api/myDrivePkg/myDrivers'

defineOptions({
    name: 'MyDriversForm'
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
const drive_typeOptions = ref([])
const AgreementTypeOptions = ref([])
const formData = ref({
            driverName: '',
            driverType: '',
            mirrorNumber: '',
            agreement: '',
            mirrorAddress: '',
            driverIdentification: '',
            version: '',
            description: '',
        })
// 验证规则
const rule = reactive({
})

const elFormRef = ref()

// 初始化方法
const init = async () => {
 // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
    if (route.query.id) {
      const res = await findMyDrivers({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    drive_typeOptions.value = await getDictFunc('drive_type')
    AgreementTypeOptions.value = await getDictFunc('AgreementType')
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
               res = await createMyDrivers(formData.value)
               break
             case 'update':
               res = await updateMyDrivers(formData.value)
               break
             default:
               res = await createMyDrivers(formData.value)
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
