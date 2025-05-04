
<template>

  <div class="product-management-container">
    <div class="content">
      <h2>设备管理</h2>
      <p>物理设备要连接到平台，需要先在平台创建设备(支持单个或批量导入创建)。设备列表包含自主创建的设备和云平台同步的设备，同时支持灵活的搜索。</p>
    </div>
    <div class="image"></div>
  </div>

  <div>
    <div class="gva-search-box">
      <el-form ref="elSearchFormRef" :inline="true" :model="searchInfo" class="demo-form-inline" :rules="searchRule" @keyup.enter="onSubmit">
<!--      <el-form-item label="创建日期" prop="CreatedAt">
      <template #label>
        <span>
          创建日期
          <el-tooltip content="搜索范围是开始日期（包含）至结束日期（不包含）">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </span>
      </template>
      <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始日期" :disabled-date="time=> searchInfo.endCreatedAt ? time.getTime() > searchInfo.endCreatedAt.getTime() : false"></el-date-picker>
       —
      <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束日期" :disabled-date="time=> searchInfo.startCreatedAt ? time.getTime() < searchInfo.startCreatedAt.getTime() : false"></el-date-picker>
      </el-form-item>-->

        <el-form-item label="" prop="productName">
          <el-select
              v-model="searchInfo.product_name"
              clearable
              placeholder="产品范围（全部）"
          >
            <el-option
                v-for="item in ProductGroupOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>


<!--
            <el-form-item label="" prop="product_range">
  <el-select v-model="searchInfo.product_range" clearable filterable placeholder="产品范围（全部）" @clear="()=>{searchInfo.product_range=undefined}">
    <el-option v-for="(item,key) in productRangeOptions" :key="key" :label="item.label" :value="item.value" />
  </el-select>
</el-form-item>
-->

            <el-form-item label="" prop="platform">
  <el-select v-model="searchInfo.platform" clearable filterable placeholder="平台（全部）" @clear="()=>{searchInfo.platform=undefined}">
    <el-option v-for="(item,key) in platformTypeOptions" :key="key" :label="item.label" :value="item.value" />
  </el-select>
</el-form-item>
            
            <el-form-item label="" prop="drive">
  <el-select v-model="searchInfo.drive" clearable filterable placeholder="驱动（全部）" @clear="()=>{searchInfo.drive=undefined}">
    <el-option v-for="(item,key) in driveOptions" :key="key" :label="item.label" :value="item.value" />
  </el-select>
</el-form-item>
            
            <el-form-item label="" prop="status">
  <el-select v-model="searchInfo.status" clearable filterable placeholder="状态（全部）" @clear="()=>{searchInfo.status=undefined}">
    <el-option v-for="(item,key) in driveStatusOptions" :key="key" :label="item.label" :value="item.value" />
  </el-select>
</el-form-item>
            
            <el-form-item label="" prop="drive_name">
  <el-input v-model="searchInfo.drive_name" placeholder="设备名称" />
</el-form-item>
            

        <template v-if="showAllQuery">
          <!-- 将需要控制显示状态的查询条件添加到此范围内 -->
        </template>

        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button icon="refresh" @click="onReset">重置</el-button>
          <el-button link type="primary" icon="arrow-down" @click="showAllQuery=true" v-if="!showAllQuery">展开</el-button>
          <el-button link type="primary" icon="arrow-up" @click="showAllQuery=false" v-else>收起</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
        <div class="gva-btn-list">
            <el-button v-auth="btnAuth.add" type="primary" icon="plus" @click="openDialog()">新增</el-button>
<!--            <el-button v-auth="btnAuth.batchDelete" icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="onDelete">删除</el-button>
            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="devicePkg_Devices" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="devicePkg_Devices" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="devicePkg_Devices" @on-success="getTableData" />-->
        </div>
        <el-table
        ref="multipleTable"
        style="width: 100%"
        tooltip-effect="dark"
        :data="tableData"
        row-key="ID"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />

          <el-table-column align="left" label="设备ID" prop="ID" width="120" />

<!--        <el-table-column sortable align="left" label="日期" prop="CreatedAt"width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column>-->
        
<!--            <el-table-column align="left" label="产品范围" prop="product_range" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.product_range,productRangeOptions) }}
    </template>
</el-table-column>-->
            <el-table-column align="left" label="平台" prop="platform" width="150">
    <template #default="scope">
    {{ filterDict(scope.row.platform,platformTypeOptions) }}
    </template>
</el-table-column>
<!--            <el-table-column align="left" label="驱动" prop="drive" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.drive,driveOptions) }}
    </template>
</el-table-column>-->
            <el-table-column align="left" label="状态" prop="status" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.status,driveStatusOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="设备添加方式" prop="add_device_method" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.add_device_method,addDeviceMethodOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="设备名称" prop="drive_name" width="120" />

            <el-table-column align="left" label="所属产品" prop="belonging_products" width="120" />

            <el-table-column align="left" label="关联驱动" prop="association_driven" width="120" />

<!--            <el-table-column label="设备描述" prop="device_description" width="200">
   <template #default="scope">
      [富文本内容]
   </template>
</el-table-column>-->
        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateDevicesFunc(scope.row)">编辑</el-button>
            <el-button  v-auth="btnAuth.delete" type="primary" link icon="delete" @click="deleteRow(scope.row)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <div class="gva-pagination">
            <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            />
        </div>
    </div>
    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="dialogFormVisible" :show-close="false" :before-close="closeDialog">
       <template #header>
              <div class="flex justify-between items-center">
                <span class="text-lg">{{type==='create'?'新增':'编辑'}}</span>
                <div>
                  <el-button :loading="btnLoading" type="primary" @click="enterDialog">确 定</el-button>
                  <el-button @click="closeDialog">取 消</el-button>
                </div>
              </div>
            </template>

          <el-form :model="formData" label-position="top" ref="elFormRef" :rules="rule" label-width="80px">
<!--            <el-form-item label="产品范围:" prop="product_range">
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
</el-form-item>-->
<!--            <el-form-item label="设备添加方式:" prop="add_device_method">
    <el-select v-model="formData.add_device_method" placeholder="请选择设备添加方式" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in addDeviceMethodOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>-->
            <el-form-item label="设备添加方式:" prop="add_device_method">
              <el-radio-group v-model="formData.add_device_method" style="width: 100%">
                <el-radio
                    v-for="(item, key) in addDeviceMethodOptions"
                    :key="key"
                    :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-if="formData.add_device_method === '1'">


              <el-form-item label="设备名称:" prop="drive_name">
                <el-input v-model="formData.drive_name" :clearable="true" placeholder="请输入设备名称" />
              </el-form-item>
              <!--            <el-form-item label="所属产品:" prop="belonging_products">
                  <el-input v-model="formData.belonging_products" :clearable="true" placeholder="请输入所属产品" />
              </el-form-item>-->
              <el-form-item label="所属产品" prop="belonging_products">
                <el-select
                    v-model="formData.belonging_products"
                    placeholder="请输入所属产品"
                    allow-create
                    filterable
                    default-first-option
                >
                  <el-option
                      v-for="item in ProductGroupTwoOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>

<!--              <el-form-item label="关联驱动:" prop="association_driven">
                <el-input v-model="formData.association_driven" :clearable="true" placeholder="请输入关联驱动" />
              </el-form-item>-->

              <el-form-item label="关联驱动" prop="driver_name">
                <el-select
                    v-model="formData.association_driven"
                    placeholder="请输入关联驱动"
                    allow-create
                    filterable
                    default-first-option
                >
                  <el-option
                      v-for="item in DriverGroupOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="设备描述:" prop="device_description">
                <RichEdit v-model="formData.device_description"/>
              </el-form-item>

            </div>

            <div v-if="formData.add_device_method === '2'">

              <el-form-item label="上传设备表:">
                <ImportExcel template-id="api" @on-success="getTableData" />
              </el-form-item>


              <div style="height: 20px;">

              </div>
              <el-form-item label="所属产品" prop="belonging_products">
                <el-select
                    v-model="formData.belonging_products"
                    placeholder="请输入所属产品"
                    allow-create
                    filterable
                    default-first-option
                >
                  <el-option
                      v-for="item in ProductGroupTwoOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
<!--              <el-form-item label="关联驱动:" prop="association_driven">
                <el-input v-model="formData.association_driven" :clearable="true" placeholder="请输入关联驱动" />
              </el-form-item>-->

              <el-form-item label="关联驱动" prop="driver_name">
                <el-select
                    v-model="formData.association_driven"
                    placeholder="请输入关联驱动"
                    allow-create
                    filterable
                    default-first-option
                >
                  <el-option
                      v-for="item in DriverGroupOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>

          </el-form>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
            <el-descriptions :column="1" border>
<!--                    <el-descriptions-item label="产品范围">
    {{ detailFrom.product_range }}
</el-descriptions-item>-->
                    <el-descriptions-item label="平台">
    {{ detailFrom.platform }}
</el-descriptions-item>
                    <el-descriptions-item label="驱动">
    {{ detailFrom.drive }}
</el-descriptions-item>
                    <el-descriptions-item label="状态">
    {{ detailFrom.status }}
</el-descriptions-item>
                    <el-descriptions-item label="设备添加方式">
    {{ detailFrom.add_device_method }}
</el-descriptions-item>
                    <el-descriptions-item label="设备名称">
    {{ detailFrom.drive_name }}
</el-descriptions-item>
                    <el-descriptions-item label="所属产品">
    {{ detailFrom.belonging_products }}
</el-descriptions-item>
                    <el-descriptions-item label="关联驱动">
    {{ detailFrom.association_driven }}
</el-descriptions-item>
                    <el-descriptions-item label="设备描述">
    <RichView v-model="detailFrom.device_description" />
</el-descriptions-item>
            </el-descriptions>
        </el-drawer>

  </div>
</template>

<script setup>
import {
  createDevices,
  deleteDevices,
  deleteDevicesByIds,
  updateDevices,
  findDevices,
  getDevicesList, getProductGroups, getProductTwoGroups, getDriverGroups
} from '@/api/devicePkg/devices'
// 富文本组件
import RichEdit from '@/components/richtext/rich-edit.vue'
import RichView from '@/components/richtext/rich-view.vue'

// 全量引入格式化工具 请按需保留
import { getDictFunc, formatDate, formatBoolean, filterDict ,filterDataSource, returnArrImg, onDownloadFile } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'
// 引入按钮权限标识
import { useBtnAuth } from '@/utils/btnAuth'
import { useAppStore } from "@/pinia"

// 导出组件
import ExportExcel from '@/components/exportExcel/exportExcel.vue'
// 导入组件
import ImportExcel from '@/components/exportExcel/importExcel.vue'
// 导出模板组件
import ExportTemplate from '@/components/exportExcel/exportTemplate.vue'
import {getApiGroups} from "@/api/api";


defineOptions({
    name: 'Devices'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)

// 自动化生成的字典（可能为空）以及字段
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
            add_device_method: '1',
            drive_name: '',
            belonging_products: '',
            association_driven: '',
            device_description: '',
            productName:  '',
            name: '',
            driver_name:'',
        })



// 验证规则
const rule = reactive({
               add_device_method : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               },
               {
                   whitespace: true,
                   message: '不能只输入空格',
                   trigger: ['input', 'blur'],
              }
              ],
               drive_name : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               },
               {
                   whitespace: true,
                   message: '不能只输入空格',
                   trigger: ['input', 'blur'],
              }
              ],
               belonging_products : [{
                   required: true,
                   message: '',
                   trigger: ['input','blur'],
               },
               {
                   whitespace: true,
                   message: '不能只输入空格',
                   trigger: ['input', 'blur'],
              }
              ],
})

const searchRule = reactive({
  CreatedAt: [
    { validator: (rule, value, callback) => {
      if (searchInfo.value.startCreatedAt && !searchInfo.value.endCreatedAt) {
        callback(new Error('请填写结束日期'))
      } else if (!searchInfo.value.startCreatedAt && searchInfo.value.endCreatedAt) {
        callback(new Error('请填写开始日期'))
      } else if (searchInfo.value.startCreatedAt && searchInfo.value.endCreatedAt && (searchInfo.value.startCreatedAt.getTime() === searchInfo.value.endCreatedAt.getTime() || searchInfo.value.startCreatedAt.getTime() > searchInfo.value.endCreatedAt.getTime())) {
        callback(new Error('开始日期应当早于结束日期'))
      } else {
        callback()
      }
    }, trigger: 'change' }
  ],
})

const elFormRef = ref()
const elSearchFormRef = ref()

// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})
// 重置
const onReset = () => {
  searchInfo.value = {}
  getTableData()
}

// 搜索
const onSubmit = () => {
  elSearchFormRef.value?.validate(async(valid) => {
    if (!valid) return
    page.value = 1
    getTableData()
  })
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

// 修改页面容量
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await getDevicesList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const ProductGroupOptions = ref([])
const productGroupMap = ref([])

const productGroup = async () => {
  const res = await getProductGroups()
  if (res.code === 0) {
    const groups = res.data
    ProductGroupOptions.value = groups.map((item) => ({
      label: item.productName,
      value: item.productName
    }))
    productGroupMap.value = res.data.productGroupMap
  }
}

const ProductGroupTwoOptions = ref([])
const productGroupTwoMap = ref([])

const productTwoGroup = async () => {
  const res = await getProductTwoGroups()
  if (res.code === 0) {
    const groups = res.data
    ProductGroupTwoOptions.value = groups.map((item) => ({
      label: item.name,
      value: item.name
    }))
    productGroupTwoMap.value = res.data.productGroupTwoMap
  }
}

const DriverGroupOptions = ref([])
const driverGroupMap = ref([])

const driverGroup = async () => {
  const res = await getDriverGroups()
  if (res.code === 0) {
    const groups = res.data
    DriverGroupOptions.value = groups.map((item) => ({
      label: item.driver_name,
      value: item.driver_name
    }))
    driverGroupMap.value = res.data.driverGroupMap
  }
}

getTableData()
productGroup()
productTwoGroup()
driverGroup()
// ============== 表格控制部分结束 ===============

// 获取需要的字典 可能为空 按需保留
const setOptions = async () =>{
    addDeviceMethodOptions.value = await getDictFunc('addDeviceMethod')
    platformTypeOptions.value = await getDictFunc('platformType')
    driveStatusOptions.value = await getDictFunc('driveStatus')
    productRangeOptions.value = await getDictFunc('productRange')
    driveOptions.value = await getDictFunc('drive')
}

// 获取需要的字典 可能为空 按需保留
setOptions()


// 多选数据
const multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

// 删除行
const deleteRow = (row) => {
    ElMessageBox.confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
            deleteDevicesFunc(row)
        })
    }

// 多选删除
const onDelete = async() => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
      const IDs = []
      if (multipleSelection.value.length === 0) {
        ElMessage({
          type: 'warning',
          message: '请选择要删除的数据'
        })
        return
      }
      multipleSelection.value &&
        multipleSelection.value.map(item => {
          IDs.push(item.ID)
        })
      const res = await deleteDevicesByIds({ IDs })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        if (tableData.value.length === IDs.length && page.value > 1) {
          page.value--
        }
        getTableData()
      }
      })
    }

// 行为控制标记（弹窗内部需要增还是改）
const type = ref('')

// 更新行
const updateDevicesFunc = async(row) => {
    const res = await findDevices({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteDevicesFunc = async (row) => {
    const res = await deleteDevices({ ID: row.ID })
    if (res.code === 0) {
        ElMessage({
                type: 'success',
                message: '删除成功'
            })
            if (tableData.value.length === 1 && page.value > 1) {
            page.value--
        }
        getTableData()
    }
}

// 弹窗控制标记
const dialogFormVisible = ref(false)

// 打开弹窗
const openDialog = () => {
    type.value = 'create'
    dialogFormVisible.value = true
}

// 关闭弹窗
const closeDialog = () => {
    dialogFormVisible.value = false
    formData.value = {
        product_range: '',
        platform: '',
        drive: '',
        status: '',
        add_device_method: '1',
        drive_name: '',
        belonging_products: '',
        association_driven: '',
        device_description: '',
        productName: '',
        name: '',
        driver_name:'',
        }
}
// 弹窗确定
const enterDialog = async () => {
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
                closeDialog()
                getTableData()
              }
      })
}

const detailFrom = ref({})

// 查看详情控制标记
const detailShow = ref(false)


// 打开详情弹窗
const openDetailShow = () => {
  detailShow.value = true
}


// 打开详情
const getDetails = async (row) => {
  // 打开弹窗
  const res = await findDevices({ ID: row.ID })
  if (res.code === 0) {
    detailFrom.value = res.data
    openDetailShow()
  }
}


// 关闭详情弹窗
const closeDetailShow = () => {
  detailShow.value = false
  detailFrom.value = {}
}



</script>

<style>
.product-management-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #f5f5f5;
}

.content {
  max-width: 60%;
}

.content h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.content p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.image {
  width: 40%;
  height: 150px; /* 调整高度以适应你的需求 */
  background-image: url('src/assets/one.png'); /* 替换为你的背景图像路径 */
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
