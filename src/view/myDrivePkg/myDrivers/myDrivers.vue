
<template>
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
      
            <el-form-item label="驱动名称" prop="driverName">
  <el-input v-model="searchInfo.driverName" placeholder="搜索条件" />
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
<!--        <div class="gva-btn-list">
            <el-button v-auth="btnAuth.add" type="primary" icon="plus" @click="openDialog()">新增</el-button>
            <el-button v-auth="btnAuth.batchDelete" icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="onDelete">删除</el-button>
            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="myDrivePkg_MyDrivers" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="myDrivePkg_MyDrivers" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="myDrivePkg_MyDrivers" @on-success="getTableData" />
        </div>-->
        <el-table
        ref="multipleTable"
        style="width: 100%"
        tooltip-effect="dark"
        :data="tableData"
        row-key="ID"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />

          <el-table-column align="left" label="镜像编号" prop="mirrorNumber" width="360" />
        
            <el-table-column align="left" label="驱动名称" prop="driverName" width="120" />

          <el-table-column align="left" label="版本" prop="version" width="120" />

            <el-table-column align="left" label="驱动类型" prop="driverType" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.driverType,drive_typeOptions) }}
    </template>
</el-table-column>


<!--            <el-table-column align="left" label="协议" prop="agreement" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.agreement,AgreementTypeOptions) }}
    </template>
</el-table-column>-->
<!--            <el-table-column align="left" label="驱动镜像地址" prop="mirrorAddress" width="120" />-->

<!--            <el-table-column align="left" label="驱动标识" prop="driverIdentification" width="120" />-->



<!--            <el-table-column align="left" label="描述" prop="description" width="120" />-->

          <el-table-column sortable align="left" label="创建日期" prop="CreatedAt"width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
          </el-table-column>


        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
<!--            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateMyDriversFunc(scope.row)">编辑</el-button>-->
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
          </el-form>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
            <el-descriptions :column="1" border>
                    <el-descriptions-item label="驱动名称">
    {{ detailFrom.driverName }}
</el-descriptions-item>
                    <el-descriptions-item label="驱动类型">
    {{ detailFrom.driverType }}
</el-descriptions-item>
                    <el-descriptions-item label="镜像编号">
    {{ detailFrom.mirrorNumber }}
</el-descriptions-item>
                    <el-descriptions-item label="协议">
    {{ detailFrom.agreement }}
</el-descriptions-item>
                    <el-descriptions-item label="驱动镜像地址">
    {{ detailFrom.mirrorAddress }}
</el-descriptions-item>
                    <el-descriptions-item label="驱动标识">
    {{ detailFrom.driverIdentification }}
</el-descriptions-item>
                    <el-descriptions-item label="版本">
    {{ detailFrom.version }}
</el-descriptions-item>
                    <el-descriptions-item label="描述">
    {{ detailFrom.description }}
</el-descriptions-item>
            </el-descriptions>
        </el-drawer>

  </div>
</template>

<script setup>
import {
  createMyDrivers,
  deleteMyDrivers,
  deleteMyDriversByIds,
  updateMyDrivers,
  findMyDrivers,
  getMyDriversList
} from '@/api/myDrivePkg/myDrivers'

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


defineOptions({
    name: 'MyDrivers'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)

// 自动化生成的字典（可能为空）以及字段
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
  const table = await getMyDriversList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
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
    drive_typeOptions.value = await getDictFunc('drive_type')
    AgreementTypeOptions.value = await getDictFunc('AgreementType')
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
            deleteMyDriversFunc(row)
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
      const res = await deleteMyDriversByIds({ IDs })
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
const updateMyDriversFunc = async(row) => {
    const res = await findMyDrivers({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteMyDriversFunc = async (row) => {
    const res = await deleteMyDrivers({ ID: row.ID })
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
        driverName: '',
        driverType: '',
        mirrorNumber: '',
        agreement: '',
        mirrorAddress: '',
        driverIdentification: '',
        version: '',
        description: '',
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
  const res = await findMyDrivers({ ID: row.ID })
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

</style>
