
<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" ref="elFormRef" label-position="right" :rules="rule" label-width="80px">
        <el-form-item label="存储平台:" prop="platform">
    <el-select v-model="formData.platform" placeholder="请选择存储平台" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in platformTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="产品名称:" prop="productName">
    <el-input v-model="formData.productName" :clearable="true" placeholder="请输入产品名称" />
</el-form-item>
        <el-form-item label="所属品类:" prop="category">
    <el-select v-model="formData.category" placeholder="请选择所属品类" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in categoryOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="选择标准品类:" prop="selectCategory">
    <el-input v-model="formData.selectCategory" :clearable="true" placeholder="请输入选择标准品类" />
</el-form-item>
        <el-form-item label="节点类型:" prop="nodeType">
    <el-select v-model="formData.nodeType" placeholder="请选择节点类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in nodeTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="接入网关协议:" prop="gatewayProtocol">
    <el-select v-model="formData.gatewayProtocol" placeholder="请选择接入网关协议" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in gatewayProtocolOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="数据格式:" prop="dataFormat">
    <el-select v-model="formData.dataFormat" placeholder="请选择数据格式" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in dataFormatOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="网络类型:" prop="networkType">
    <el-select v-model="formData.networkType" placeholder="请选择网络类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in networkTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
        <el-form-item label="工厂:" prop="factory">
    <el-input v-model="formData.factory" :clearable="true" placeholder="请输入工厂" />
</el-form-item>
        <el-form-item label="产品描述:" prop="productDescription">
    <RichEdit v-model="formData.productDescription"/>
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
  createProducts,
  updateProducts,
  findProducts
} from '@/api/productPkg/products'

defineOptions({
    name: 'ProductsForm'
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
const nodeTypeOptions = ref([])
const gatewayProtocolOptions = ref([])
const dataFormatOptions = ref([])
const platformTypeOptions = ref([])
const categoryOptions = ref([])
const networkTypeOptions = ref([])
const formData = ref({
            platform: '',
            productName: '',
            category: '',
            selectCategory: '',
            nodeType: '',
            gatewayProtocol: '',
            dataFormat: '',
            networkType: '',
            factory: '',
            productDescription: '',
        })
// 验证规则
const rule = reactive({
               category : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               selectCategory : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               nodeType : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               gatewayProtocol : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               dataFormat : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               }],
               networkType : [{
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
      const res = await findProducts({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    nodeTypeOptions.value = await getDictFunc('nodeType')
    gatewayProtocolOptions.value = await getDictFunc('gatewayProtocol')
    dataFormatOptions.value = await getDictFunc('dataFormat')
    platformTypeOptions.value = await getDictFunc('platformType')
    categoryOptions.value = await getDictFunc('category')
    networkTypeOptions.value = await getDictFunc('networkType')
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
               res = await createProducts(formData.value)
               break
             case 'update':
               res = await updateProducts(formData.value)
               break
             default:
               res = await createProducts(formData.value)
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
