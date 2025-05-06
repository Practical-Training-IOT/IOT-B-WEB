
<template>
  <div>
    <div class="gva-search-box">

      <div class="page-header">
        <div class="page-header-content">
          <div class="page-header-title">
            <h1>规则引擎</h1>
            <p>规则引擎提供数据流转能力，可对接入平台的设备数据进行过滤转换，并将数据推送至用户指定的消息目的地。规则引擎流转规则需要配置消息源（推送消息类型）、条件过滤规则及消息目的地（推送方式）。</p>
          </div>
          <div class="page-header-image">
            <img src="@/assets/resources.svg" alt="资源管理背景图">
          </div>
        </div>
      </div>

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

        <el-form-item label="是否开启">
          <el-select
              v-model="searchInfo.isEnabled"
              clearable
              placeholder="请选择"
          >

            <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>

          </el-select>
        </el-form-item>

        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="searchInfo.ruleName" placeholder="搜索条件" />
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
            <el-button v-auth="btnAuth.batchDelete" icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="onDelete">删除</el-button>
            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="rules_RuleInfo" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="rules_RuleInfo" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="rules_RuleInfo" @on-success="getTableData" />
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
            <el-table-column align="left" label="规则名称" prop="ruleName" width="120" />

            <el-table-column align="left" label="规则描述" prop="ruleDescription" width="120" />

          <el-table-column align="left" label="转发方式" prop="forwardMethod" width="120" />

          <el-table-column sortable align="left" label="日期" prop="CreatedAt" width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
          </el-table-column>

<!--            <el-table-column align="left" label="是否显示" prop="isEnabled" width="120">

    <template #default="scope">{{ formatBoolean(scope.row.isEnabled) }}</template>
</el-table-column>-->
          <el-table-column align="left" label="是否显示" prop="isEnabled" width="120">
            <template #default="scope">
              <el-switch
                  v-model="scope.row.isEnabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleSwitchChanges(scope.row)"
              />
            </template>
          </el-table-column>
        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateRuleInfoFunc(scope.row)">编辑</el-button>
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
    <el-drawer
        destroy-on-close
        :size="appStore.drawerSize"
        v-model="dialogFormVisible"
        :show-close="false"
        :before-close="closeDialog"
        class="glass-drawer"
    >
      <div class="glass-container">
        <!-- 头部 -->
        <div class="drawer-header">
          <span class="drawer-span">{{ type === 'create' ? '新增规则' : '编辑规则' }}</span>
          <div>
            <el-button :loading="btnLoading" type="primary" @click="enterDialog">确 定</el-button>
            <el-button @click="closeDialog">取 消</el-button>
          </div>
        </div>

        <!-- 表单内容 -->
        <el-form ref="elFormRef" :model="formData" :rules="rule" label-position="top" label-width="80px" class="form-content">
          <!-- 规则名称 -->
          <el-form-item label="规则名称:" prop="ruleName">
            <el-input v-model="formData.ruleName" clearable placeholder="请输入规则名称" @change="toggleSectionsVisibility"/>
          </el-form-item>
          <!-- 规则描述 -->
          <el-form-item label="规则描述:" prop="ruleDescription">
            <el-input v-model="formData.ruleDescription" clearable placeholder="请输入规则描述"/>
          </el-form-item>
          <!-- 启用状态 -->
          <el-form-item label="启用状态:" prop="isEnabled">
            <el-switch v-model="formData.isEnabled" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>

          <!-- 条件过滤部分 -->
          <section v-if="showConditionFilter || type==='update'" class="condition-section">
            <h3>条件过滤</h3>
            <p>(SELECT [查询字段] FROM [消息源] WHERE [条件])，多个筛选项之间取交集</p>
            <el-alert title="重要提示：修改消息源和查询字段可能会导致输出的数据格式有变化" type="warning"></el-alert>
            <el-form-item label="消息总线:" prop="httpMethod">
              <el-select v-model="formData.messageSource" placeholder="请选择消息总线" @change="toggleShowSectionsVisibility" style="width:100%" filterable clearable>
                <el-option v-for="(item,key) in MessageSourceOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="查询字段:" prop="queryFields">
              <el-input v-model="formData.queryFields" placeholder="请输入查询字段" />
            </el-form-item>
            <el-form-item label="条件:" prop="conditions">
              <el-input v-model="formData.conditions" placeholder="请输入条件" />
            </el-form-item>
            <p>SQL语句展示:<b>SELECT  {{ formData.queryFields }} FROM {{formData.messageSource}} WHERE {{formData.conditions}}</b></p>
          </section>

          <!-- 转发方式部分 -->
          <section v-if="showForwardMethod || type==='update'" class="forward-method-section">
            <h3>转发方式</h3>
            <el-radio-group v-model="formData.forwardMethod" class="radio-group" @change="changMeth">
              <el-radio label="HTTP">HTTP推送</el-radio>
              <el-radio label="MQTT">消息队列MQTT</el-radio>
              <el-radio label="Kafka">消息队列Kafka</el-radio>
            </el-radio-group>
            <el-form-item label="API分组">
              <el-select
                  v-model="formData.resource"
                  clearable
                  placeholder="请选择"
              >
                <el-option
                    v-for="item in resourcesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
<!--            <el-form-item label="使用资源:" prop="resource">
              <el-select v-model="formData.resource" placeholder="请选择资源">
                <el-option label="asd" value="asd"></el-option>
              </el-select>
            </el-form-item>-->
            <span>您可前往<router-link to="/layout/seniorManagement/resources"><b>资源管理</b></router-link>，添加您的资源</span>
          </section>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
      <div class="module">
        <!-- 基础信息 -->
        <h3>基础信息</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="规则ID">{{ detailFrom.ID }}</el-descriptions-item>
          <el-descriptions-item label="规则名称">{{ detailFrom.ruleName }}</el-descriptions-item>
          <el-descriptions-item label="规则描述">{{ detailFrom.ruleDescription }}</el-descriptions-item>
          <el-descriptions-item label="启用状态">{{ detailFrom.isEnabled ? '启用' : '停用' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="module">
        <!-- 条件过滤部分 -->
        <h3>条件过滤</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="消息源">{{ detailFrom.messageSource }}</el-descriptions-item>
          <el-descriptions-item label="查询字段">{{ detailFrom.queryFields }}</el-descriptions-item>
          <el-descriptions-item label="条件">{{ detailFrom.conditions }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="module">
        <!-- 转发方式部分 -->
        <h3>转发方式</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="转发方式">{{ detailFrom.forwardMethod }}</el-descriptions-item>
          <el-descriptions-item label="使用资源">{{ detailFrom.resource }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

  </div>
</template>

<script setup>
import {
  createRuleInfo,
  deleteRuleInfo,
  deleteRuleInfoByIds,
  updateRuleInfo,
  findRuleInfo,
  getRuleInfoList, handleSwitchChange
} from '@/api/rules/ruleInfo'

// 全量引入格式化工具 请按需保留
import {formatDate, getDictFunc} from '@/utils/format'
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
import {getResources} from "@/api/resources_iot/resources";


defineOptions({
    name: 'RuleInfo'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)

const MessageSourceOptions=ref([])
// 自动化生成的字典（可能为空）以及字段
const formData = ref({
  ruleName: '',
  ruleDescription: '',
  isEnabled: true,
  messageSource: '',
  queryFields: '*',
  conditions: '',
  sqlStatement: '',
  forwardMethod: '',
  resource: ''
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
    if (searchInfo.value.isEnabled === ""){
        searchInfo.value.isEnabled=null
    }
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
  const table = await getRuleInfoList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
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
  MessageSourceOptions.value = await getDictFunc('MessageSource')
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
            deleteRuleInfoFunc(row)
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
      const res = await deleteRuleInfoByIds({ IDs })
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
const updateRuleInfoFunc = async(row) => {
    const res = await findRuleInfo({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}

const showConditionFilter=ref(false)
const showForwardMethod=ref(false)

const toggleSectionsVisibility=() =>{
  if(formData.value.ruleName!==""){
    showConditionFilter.value = true;
  }else if (formData.value.ruleName===""){
    showConditionFilter.value = false;
  }
}

const toggleShowSectionsVisibility=()=>{
  console.log(formData.value.messageSource,"zzz")
  if(formData.value.messageSource!==""){
    showForwardMethod.value = true;
  }else if (formData.value.messageSource===""){
    showForwardMethod.value = false;
  }
}

// 删除行
const deleteRuleInfoFunc = async (row) => {
    const res = await deleteRuleInfo({ ID: row.ID })
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

const handleSwitchChanges=async (row) => {
  console.log(row)
  const res = await handleSwitchChange({status: row.isEnabled,id: row.ID})
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '修改成功'
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
      ruleName: '',
      ruleDescription: '',
      isEnabled: true,
      messageSource: '',
      queryFields: '*',
      conditions: '',
      sqlStatement: '',
      forwardMethod: '',
      resource: ''
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
                  res = await createRuleInfo(formData.value)
                  break
                case 'update':
                  res = await updateRuleInfo(formData.value)
                  break
                default:
                  res = await createRuleInfo(formData.value)
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

const resourcesOptions = ref([])
const resourcesMap = ref({})
const getGroup = async () => {
  const res = await getResources({name: formData.value.forwardMethod})
  if (res.code === 0) {
    const groups = res.data
    resourcesOptions.value = groups.map((item) => ({
      label: item.name,
      value: item.ID
    }))
    resourcesMap.value = res.data.apiGroupMap
  }
}

const option=ref([
  {
    value: true,
    label: '是'
  },
  {
    value: false,
    label: '否'
  },
  {
    value: undefined,
    label: '全部显示'
  }
])

const changMeth= async ()=>{
  getGroup()
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
  console.log(row)
  const res = await findRuleInfo({ ID: row.ID })
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

<style scoped>

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
  background-color: #1a1a1a; /* 背景色 */
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.page-header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute; /* 图片定位为绝对，以覆盖背景 */
  top: 0;
  left: 0;
  border-radius: inherit;
}

.glass-drawer :deep(.el-drawer__body) {
  padding: 0;
  overflow-y: auto;
}

.glass-container {
  /* 使用浅灰色到浅蓝色的线性渐变 */
  background: linear-gradient(135deg, rgba(240, 240, 240, 0.9) 0%, rgba(210, 230, 255, 0.9) 100%);
  background: -moz-linear-gradient(135deg, rgba(240, 240, 240, 0.9) 0%, rgba(210, 230, 255, 0.9) 100%); /* FF3.6+ */
  background: -webkit-linear-gradient(135deg, rgba(240, 240, 240, 0.9) 0%, rgba(210, 230, 255, 0.9) 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(135deg, rgba(240, 240, 240, 0.9) 0%, rgba(210, 230, 255, 0.9) 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(135deg, rgba(240, 240, 240, 0.9) 0%, rgba(210, 230, 255, 0.9) 100%); /* IE10+ */
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e6f0f0f0', endColorstr='#e6d2e6ff'); /* IE6-9 fallback on horizontal gradient */

  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  color: #000; /* 根据背景颜色调整文字颜色为黑色或深色 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffffffcc;
}

.drawer-span {
  color: rgba(0, 0, 0, 0.87);
}

.form-content .el-form-item__label {
  color: #ffffffcc;
}

.form-content .el-input__inner,
.form-content .el-select .el-input__inner,
.form-content .el-textarea__inner {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
}

.condition-section,
.forward-method-section {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.condition-section h3,
.forward-method-section h3 {
  color: rgba(0, 0, 0, 0.87);
}

.radio-group .el-radio__label {
  color: #ffffffcc;
}

.module {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 4px;
}

.module h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

/* 给每个模块设置一个轻微的背景颜色 */
.module:nth-child(odd) {
  background-color: #f9f9f9;
}

.module:nth-child(even) {
  background-color: #eef2f6;
}
</style>

