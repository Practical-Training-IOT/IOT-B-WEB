<template>

  <div class="page-header">
    <div class="page-header-content">
      <div class="page-header-title">
        <h2>产品管理</h2>
        <p>在物联网平台中，某一类具有相同能力或特征的设备的合集被称为一款产品。赢创万联已经打通了市面上主流iot云平台，可以把云平台产品数据同步到本地，第一次使用请点击数据同步按钮进行数据同步。</p>
      </div>
      <div  class="page-header-image"><img src="@/assets/resources.svg" alt="资源管理背景图"></div>
    </div>
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
      
            <el-form-item label="存储平台" prop="platform">
  <el-select v-model="searchInfo.platform" clearable filterable placeholder="云平台（全部）" @clear="()=>{searchInfo.platform=undefined}">
    <el-option v-for="(item,key) in platformTypeOptions" :key="key" :label="item.label" :value="item.value" />
  </el-select>
</el-form-item>
            
            <el-form-item label="产品名称" prop="productName">
  <el-input v-model="searchInfo.productName" placeholder="搜索条件" />
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
<!--            <el-button v-auth="btnAuth.batchDelete" icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="onDelete">删除</el-button>-->
<!--            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="productPkg_Products" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="productPkg_Products" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="productPkg_Products" @on-success="getTableData" />-->
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
        
<!--        <el-table-column sortable align="left" label="日期" prop="CreatedAt"width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column>-->
        
<!--            <el-table-column align="left" label="存储平台" prop="platform" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.platform,platformTypeOptions) }}
    </template>
</el-table-column>-->
          <el-table-column align="left" label="产品ID" prop="ID" width="120" />

            <el-table-column align="left" label="产品名称" prop="productName" width="120" />


<!--            <el-table-column align="left" label="所属品类" prop="category" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.category,categoryOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="选择标准品类" prop="selectCategory" width="120" />


            <el-table-column align="left" label="接入网关协议" prop="gatewayProtocol" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.gatewayProtocol,gatewayProtocolOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="数据格式" prop="dataFormat" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.dataFormat,dataFormatOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="网络类型" prop="networkType" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.networkType,networkTypeOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="工厂" prop="factory" width="120" />-->

<!--            <el-table-column label="产品描述" prop="productDescription" width="200">
   <template #default="scope">
      [富文本内容]
   </template>
</el-table-column>-->

          <el-table-column align="left" label="产品编号" prop="productCode" width="300" />

          <el-table-column align="left" label="类型" prop="nodeType" width="120">
            <template #default="scope">
              {{ filterDict(scope.row.nodeType,nodeTypeOptions) }}
            </template>
          </el-table-column>

          <el-table-column align="left" label="创建时间" prop="CreatedAt" width="250" />
          <el-table-column align="left" label="状态" prop="productStatus" width="120" />

<!--          <el-table-column label="产品描述" prop="productDescription" width="200">
            <template #default="scope">
              <div v-html="scope.row.productDescription"></div>
            </template>
          </el-table-column>-->
        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>


            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateProductsFunc(scope.row)">编辑</el-button>
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
<!--            <el-form-item label="存储平台:" prop="platform">
    <el-select v-model="formData.platform" placeholder="请选择存储平台" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in platformTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>-->
            <el-form-item label="存储平台:" prop="platform" v-show="false">
              <el-select v-model="formData.platform" placeholder="请选择存储平台" style="width:100%" filterable :clearable="true">
                <el-option v-for="(item, key) in platformTypeOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称:" prop="productName">
    <el-input v-model="formData.productName" :clearable="true" placeholder="请输入产品名称" />
</el-form-item>
<!--            <el-form-item label="所属品类:" prop="category">
    <el-select v-model="formData.category" placeholder="请选择所属品类" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in categoryOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>-->
            <el-form-item label="所属品类:" prop="category">
              <el-radio-group v-model="formData.category" style="width: 100%;" @change="handleCategoryChange">
                <el-radio
                    v-for="(item, key) in categoryOptions"
                    :key="key"
                    :label="item.value"
                    :value="item.value"
                    style="margin-right: 10px; margin-bottom: 10px;">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-if="formData.category === '1'">
              <el-form-item label="选择标准品类:" prop="selectCategory">
                <el-input
                  v-model="formData.selectCategory"
                  :clearable="true"
                  placeholder="选择标准品类"
                  @click="openStandardCategoryDialog"
                  readonly
                  :disabled="standardCategoryDialogVisible"
                />
              </el-form-item>
            </div>



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
<!--            <el-form-item label="网络类型:" prop="networkType">
    <el-select v-model="formData.networkType" placeholder="请选择网络类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in networkTypeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>-->
            <el-form-item label="网络类型:" prop="networkType">
              <el-radio-group v-model="formData.networkType" style="display: flex; align-items: center;">
                <el-radio
                    v-for="(item, key) in networkTypeOptions"
                    :key="key"
                    :label="item.value"
                    style="margin-right: 10px;">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="工厂:" prop="factory">
    <el-input v-model="formData.factory" :clearable="true" placeholder="请输入工厂" />
</el-form-item>
            <el-form-item label="产品描述:" prop="productDescription">
    <RichEdit v-model="formData.productDescription"/>
</el-form-item>
          </el-form>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
            <el-descriptions :column="1" border>
                    <el-descriptions-item label="存储平台">
    {{ detailFrom.platform }}
</el-descriptions-item>
                    <el-descriptions-item label="产品名称">
    {{ detailFrom.productName }}
</el-descriptions-item>
                    <el-descriptions-item label="所属品类">
    {{ detailFrom.category }}
</el-descriptions-item>
                    <el-descriptions-item label="选择标准品类">
    {{ detailFrom.selectCategory }}
</el-descriptions-item>
                    <el-descriptions-item label="节点类型">
    {{ detailFrom.nodeType }}
</el-descriptions-item>
                    <el-descriptions-item label="接入网关协议">
    {{ detailFrom.gatewayProtocol }}
</el-descriptions-item>
                    <el-descriptions-item label="数据格式">
    {{ detailFrom.dataFormat }}
</el-descriptions-item>
                    <el-descriptions-item label="网络类型">
    {{ detailFrom.networkType }}
</el-descriptions-item>
                    <el-descriptions-item label="工厂">
    {{ detailFrom.factory }}
</el-descriptions-item>
                    <el-descriptions-item label="产品描述">
    <RichView v-model="detailFrom.productDescription" />
</el-descriptions-item>
            </el-descriptions>
        </el-drawer>

    <!-- 标准品类选择弹窗 -->
    <el-dialog
      v-model="standardCategoryDialogVisible"
      title="选择标准品类"
      width="60%"
      :before-close="handleStandardCategoryDialogClose"
    >
      <div class="standard-category-container">
        <el-table :data="standardCategoryList" style="width: 100%">
          <el-table-column prop="CategoryName" label="品类名称" />
          <el-table-column prop="Scene" label="所属场景" />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" link @click="selectStandardCategory(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 16px; text-align: right"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="standardCategoryPage"
          :page-size="standardCategoryPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="standardCategoryTotal"
          @current-change="handleStandardCategoryPageChange"
          @size-change="handleStandardCategoryPageSizeChange"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import {
  createProducts,
  deleteProducts,
  deleteProductsByIds,
  updateProducts,
  findProducts,
  getProductsList,
  getStandardCategoryList
} from '@/api/productPkg/products'
// 富文本组件
import RichEdit from '@/components/richtext/rich-edit.vue'
import RichView from '@/components/richtext/rich-view.vue'

// 全量引入格式化工具 请按需保留
import { getDictFunc, formatDate, formatBoolean, filterDict ,filterDataSource, returnArrImg, onDownloadFile } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, watch } from 'vue'
// 引入按钮权限标识
import { useBtnAuth } from '@/utils/btnAuth'
import { useAppStore } from "@/pinia"

// 导出组件
import ExportExcel from '@/components/exportExcel/exportExcel.vue'
// 导入组件
import ImportExcel from '@/components/exportExcel/importExcel.vue'
// 导出模板组件
import ExportTemplate from '@/components/exportExcel/exportTemplate.vue'


defineOptions({
    name: 'Products'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)

// 自动化生成的字典（可能为空）以及字段
const nodeTypeOptions = ref([])
const gatewayProtocolOptions = ref([])
const dataFormatOptions = ref([])
const platformTypeOptions = ref([])
const categoryOptions = ref([])
const networkTypeOptions = ref([])
const formData = ref({
            platform: 'cloud',
            productName: '',
            category: '',
            selectCategory: '',
            nodeType: '',
            gatewayProtocol: '',
            dataFormat: '',
            networkType: '',
            factory: '',
            productDescription: '',
            productStatus: '',
            productCode: '',
        })



// 验证规则
const rule = reactive({
                productName : [{
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
               category : [{
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
               selectCategory : [{
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
               nodeType : [{
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
               gatewayProtocol : [{
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
               dataFormat : [{
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
               networkType : [{
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
  const table = await getProductsList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

getTableData()

// ============== 表格控制部分结束 ===============

// 获取需要的字典 可能为空 按需保留
const setOptions = async () =>{
    nodeTypeOptions.value = await getDictFunc('nodeType')
    gatewayProtocolOptions.value = await getDictFunc('gatewayProtocol')
    dataFormatOptions.value = await getDictFunc('dataFormat')
    platformTypeOptions.value = await getDictFunc('platformType')
    categoryOptions.value = await getDictFunc('category')
    networkTypeOptions.value = await getDictFunc('networkType')
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
            deleteProductsFunc(row)
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
      const res = await deleteProductsByIds({ IDs })
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
const updateProductsFunc = async(row) => {
    const res = await findProducts({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteProductsFunc = async (row) => {
    const res = await deleteProducts({ ID: row.ID })
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
  const res = await findProducts({ ID: row.ID })
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

// 标准品类选择弹窗控制
const standardCategoryDialogVisible = ref(false)
const standardCategoryList = ref([])
const standardCategoryPage = ref(1)
const standardCategoryPageSize = ref(10)
const standardCategoryTotal = ref(0)
const standardCategoryInited = ref(false)

// 打開彈窗（只在用戶點 el-input 時調用）
const openStandardCategoryDialog = async () => {
  standardCategoryDialogVisible.value = true
  standardCategoryPage.value = 1
  await getStandardCategoryData()
}

// 分頁切換（只設置頁碼，不重置，不動dialog）
const handleStandardCategoryPageChange = (val) => {
  standardCategoryPage.value = val
  getStandardCategoryData()
}
const handleStandardCategoryPageSizeChange = (val) => {
  standardCategoryPageSize.value = val
  standardCategoryPage.value = 1
  getStandardCategoryData()
}

// 關閉彈窗
const handleStandardCategoryDialogClose = () => {
  standardCategoryDialogVisible.value = false
}

// 請求數據
const getStandardCategoryData = async () => {
  const res = await getStandardCategoryList({
    page: standardCategoryPage.value,
    pageSize: standardCategoryPageSize.value
  })
  if (res.code === 0) {
    standardCategoryList.value = res.data.list
    standardCategoryTotal.value = res.data.total
  } else {
    standardCategoryList.value = []
    standardCategoryTotal.value = 0
  }
}

// 選擇標準品類
const selectStandardCategory = (row) => {
  formData.value.selectCategory = row.CategoryName
  standardCategoryDialogVisible.value = false
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

.standard-category-container {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.page-header {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.page-header-content {
  display: flex;
  align-items: center;
  padding: 24px;
}

.page-header-title {
  flex: 1;
}

.page-header-title h1 {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.page-header-title p {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.page-header-image {
  flex: 1;
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a; /* 添加背景色 */
}

.page-header-image img {
  width: 100%;
  height: auto;
}

.protocol-highlight {
  font-size: 18px;
  font-weight: bold;
  color: red;
}

.el-drawer__body {
  padding: 20px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}

.el-select,
.el-input {
  width: 100%;
}

.el-row {
  margin-bottom: 0;
  flex-wrap: wrap;
}

.el-col {
  padding: 0 10px 20px 10px;
}

.el-form-item__label {
  font-weight: bold;
  color: #333;
}

.el-button {
  margin-top: 10px;
}

.trigger-condition-box {
  background: #fff;
  border: 2px solid #409EFF;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(64,158,255,0.08);
  padding: 32px 24px 8px 24px;
  margin-bottom: 32px;
}

.action-box {
  background: #fff;
  border: 2px dashed #67C23A;
  border-radius: 10px;
  min-height: 80px;
  margin-bottom: 32px;
  margin-top: 0;
  padding: 24px;
}

.trigger-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
}

.judge-condition-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
@media (max-width: 900px) {
  .judge-condition-row {
    flex-direction: column;
    gap: 4px;
  }
  .judge-condition-row .el-select,
  .judge-condition-row .el-input {
    width: 100% !important;
  }
}

</style>

