<template>
  <div>
    <div class="gva-search-box">

      <div class="page-header">
        <div class="page-header-content">
          <div class="page-header-title">
            <h1>场景联动</h1>
            <p>场景联动是一种开发自动化业务逻辑的编程方式，目前支持设备、时间条件触发，您可以自定义设备之间的联动规则，系统执行自定义的业务逻辑，满足多场景联动需求。</p>
          </div>
          <div class="page-header-image">
            <img src="@/assets/resources.svg" alt="资源管理背景图">
          </div>
        </div>
      </div>
      <el-form ref="elSearchFormRef" :inline="true" :model="searchInfo" class="demo-form-inline" :rules="searchRule" @keyup.enter="onSubmit">

        <el-form-item label="场景是否启用" prop="enabledstatus">
          <el-select v-model="searchInfo.enabledstatus" clearable placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场景名称" prop="scenename">
  <el-input v-model="searchInfo.scenename" placeholder="搜索条件" />
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
            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="scene_Scenes" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="scene_Scenes" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="scene_Scenes" @on-success="getTableData" />
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
        

        
            <el-table-column align="left" label="场景名称" prop="scenename" width="120" />

            <el-table-column label="场景描述" prop="scenedescription" width="200">
<!--   <template #default="scope">
      [富文本内容]
   </template>-->
</el-table-column>

          <el-table-column sortable align="left" label="日期" prop="CreatedAt" width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
          </el-table-column>

<!--            <el-table-column align="left" label="场景创建的时间。" prop="creationtime" width="180">
   <template #default="scope">{{ formatDate(scope.row.creationtime) }}</template>
</el-table-column>-->
<!--            <el-table-column align="left" label="场景是否启用" prop="enabledstatus" width="120">
    <template #default="scope">{{ formatBoolean(scope.row.enabledstatus) }}</template>
</el-table-column>-->

          <el-table-column align="left" label="是否显示" prop="isEnabled" width="120">
            <template #default="scope">
              <el-switch
                  v-model="scope.row.enabledstatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="scenesSwitchChanges(scope.row)"
              />
            </template>
          </el-table-column>

        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
              <el-button
                  type="primary"
                  link
                  icon="plus"
                  @click="addScen(scope.row)"
              >
                编辑场景
              </el-button>
            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateScenesFunc(scope.row)">编辑</el-button>
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
            <el-form-item label="场景名称" prop="scenename">
    <el-input v-model="formData.scenename" :clearable="true" placeholder="请输入场景的名称。" />
</el-form-item>
            <el-form-item label="场景描述" prop="scenedescription">
    <RichEdit v-model="formData.scenedescription"/>
</el-form-item>
<!--            <el-form-item label="场景创建的时间。:" prop="creationtime">
    <el-date-picker v-model="formData.creationtime" type="date" style="width:100%" placeholder="选择日期" :clearable="true" />
</el-form-item>-->
            <el-form-item label="场景是否启用" prop="enabledstatus">
    <el-switch v-model="formData.enabledstatus" active-color="#13ce66" inactive-color="#ff4949" clearable ></el-switch>
</el-form-item>
          </el-form>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="scenFormVisible" :show-close="false" :before-close="closeDialog">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '新增' : '编辑' }}</span>
          <div>
            <el-button :loading="btnLoading" type="primary" @click="enterSceneDialog">确 定</el-button>
            <el-button @click="closeDialog">取 消</el-button>
          </div>
        </div>
      </template>

      <el-form :model="formData" label-position="top" ref="elFormRef" :rules="rule" label-width="80px" class="form-content">
        <div class="trigger-condition-box">
          <div class="trigger-title">触发条件</div>
          <el-row :gutter="20" align="middle">
            <el-col :span="6">
              <el-form-item label="触发方式" required>
                <el-select v-model="formData.triggerMethod" placeholder="请选择" style="min-width:160px;width:100%">
                  <el-option v-for="item in TriggerModeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.triggerMethod === 'TimeTriggered'" :span="6">
              <el-form-item label="时间" required>
                <el-time-picker
                  v-model="formData.triggerTime"
                  placeholder="请选择时间"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="min-width:160px;width:100%"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.triggerMethod === 'TimeTriggered'" :span="12">
              <el-form-item label="星期" required>
                <el-button-group>
                  <el-button
                    v-for="day in weekDays"
                    :key="day.value"
                    :type="formData.triggerWeekdays.includes(day.value) ? 'primary' : 'default'"
                    @click="toggleWeekday(day.value)"
                  >
                    {{ day.label }}
                  </el-button>
                </el-button-group>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.triggerMethod === 'DeviceTriggered'" :span="6">
              <el-form-item label="触发类型" required>
                <el-select v-model="formData.triggerType" placeholder="请选择" style="min-width:160px;width:100%">
                  <el-option v-for="item in TriggerTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.triggerMethod === 'DeviceTriggered'" :span="6">
              <el-form-item label="产品" required>
                <el-select v-model="formData.product" placeholder="请选择产品" style="min-width:160px;width:100%" @change="changeProduct">
                  <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.product && formData.triggerMethod === 'DeviceTriggered'" :span="6">
              <el-form-item label="设备" required>
                <el-select v-model="formData.device" placeholder="请选择设备" style="min-width:160px;width:100%">
                  <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.product && formData.triggerMethod === 'DeviceTriggered' && formData.triggerType==='triggerdata'" :span="6">
              <el-form-item label="功能" required>
                <el-select v-model="formData.function" placeholder="请选择功能" style="min-width:160px;width:100%">
                  <el-option v-for="item in functionOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.product && formData.triggerMethod === 'DeviceTriggered' && formData.triggerType==='triggerEvent'" :span="6">
              <el-form-item label="事件" required>
                <el-select v-model="formData.function" placeholder="请选择功能" style="min-width:160px;width:100%">
                  <el-option v-for="item in functionOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.product && formData.triggerMethod === 'DeviceTriggered' && formData.triggerType==='triggerCondition'" :span="6">
              <el-form-item label="状态" required>
                <el-select v-model="formData.function" placeholder="请选择功能" style="min-width:160px;width:100%">
                  <el-option v-for="item in DriveStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.function && formData.triggerMethod === 'DeviceTriggered' && formData.triggerType==='triggerdata'" :span="6">
              <el-form-item label="取值类型" required>
                <el-select v-model="formData.valueType" placeholder="请选择取值类型" style="min-width:160px;width:100%">
                  <el-option v-for="item in ValueType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.function && formData.triggerMethod === 'DeviceTriggered' && formData.triggerType==='triggerdata'" :span="6">
              <el-form-item label="取值周期" required>
                <el-select v-model="formData.valuePeriod" placeholder="请选择取值周期" style="min-width:160px;width:100%">
                  <el-option v-for="item in ValuePeriod" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formData.function && formData.triggerMethod === 'DeviceTriggered' && formData.triggerType==='triggerdata'" :span="6">
              <el-form-item label="判断条件" required>
                <div class="judge-condition-row">
                  <el-select v-model="formData.judgeCondition" placeholder="请选择判断条件" style="width:50%">
                    <el-option v-for="item in JudgingCondition" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <el-input v-model="formData.judgeValue" placeholder="请输入" style="width:50%" />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="action-box">
          <div class="flex items-center gap-2">
            <el-button type="primary" icon="edit" @click="addParameter(formData)">
              新增动作
            </el-button>
          </div>
          <el-table :data="formData.httpHeaders" style="width: 100%; margin-top: 12px">
            <el-table-column align="left" prop="动作类型" label="动作类型" width="180">
              <template #default="scope">
                <div>
                  <el-select v-model="scope.row.key" placeholder="请选择" style="min-width:160px;width:100%">
                    <el-option v-for="item in ActionType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="产品" label="产品">
              <template #default="scope">
                <div>
                  <el-select v-model="scope.row.product" placeholder="请选择产品" style="min-width:160px;width:100%">
                    <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
<!--                  <el-input v-model="scope.row.value" />-->
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="设备" label="设备">
              <template #default="scope">
                <div>
                  <el-select v-model="scope.row.device" placeholder="请选择设备" style="min-width:160px;width:100%">
                    <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
<!--                  <el-input v-model="scope.row.value" />-->
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="功能" label="功能">
              <template #default="scope">
                <div>
                  <el-select v-model="scope.row.function" placeholder="请选择功能" style="min-width:160px;width:100%">
                    <el-option v-for="item in functionOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
<!--                  <el-input v-model="scope.row.value" />-->
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="数值" label="数值">
              <template #default="scope">
                <div>
                  <el-input v-model="scope.row.value" />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left">
              <template #default="scope">
                <div>
                  <el-button
                      type="danger"
                      icon="delete"
                      @click="deleteParameter(formData.httpHeaders, scope.$index)"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
            <el-descriptions :column="1" border>
                    <el-descriptions-item label="场景的名称。">
    {{ detailFrom.scenename }}
</el-descriptions-item>
                    <el-descriptions-item label="场景的描述。">
    <RichView v-model="detailFrom.scenedescription" />
</el-descriptions-item>
                    <el-descriptions-item label="场景创建的时间。">
    {{ detailFrom.creationtime }}
</el-descriptions-item>
                    <el-descriptions-item label="场景是否启用的状态。">
    {{ detailFrom.enabledstatus }}
</el-descriptions-item>
            </el-descriptions>
        </el-drawer>

  </div>
</template>

<script setup>
import {
  createScenes,
  deleteScenes,
  deleteScenesByIds,
  updateScenes,
  findScenes,
  getScenesList, scenesSwitchChange, getScenDevicesList, getScenFuncList, enterCreateScenes, enterUpdateScenes
} from '@/api/scene/scenes'
// 富文本组件
import RichEdit from '@/components/richtext/rich-edit.vue'
import RichView from '@/components/richtext/rich-view.vue'

// 全量引入格式化工具 请按需保留
import {formatDate, getDictFunc} from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed } from 'vue'
// 引入按钮权限标识
import { useBtnAuth } from '@/utils/btnAuth'
import { useAppStore } from "@/pinia"

// 导出组件
import ExportExcel from '@/components/exportExcel/exportExcel.vue'
// 导入组件
import ImportExcel from '@/components/exportExcel/importExcel.vue'
// 导出模板组件
import ExportTemplate from '@/components/exportExcel/exportTemplate.vue'
import {getProductGroups} from "@/api/devicePkg/devices";

defineOptions({
    name: 'Scenes'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)

const TriggerModeOptions = ref([])
const TriggerTypeOptions = ref([])
const DriveStatusOptions=ref([])
const JudgingCondition=ref([])
const ValueType=ref([])
const ValuePeriod=ref([])
const ActionType=ref([])

// 添加星期選項
const weekDays = ref([
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 },
  { label: '日', value: 0 }
])

// 添加切換星期的函數
const toggleWeekday = (day) => {
  const index = formData.value.triggerWeekdays.indexOf(day)
  if (index === -1) {
    formData.value.triggerWeekdays.push(day)
  } else {
    formData.value.triggerWeekdays.splice(index, 1)
  }
}

// 自动化生成的字典（可能为空）以及字段
const formData = ref({
  scenename: '',
  scenedescription: '',
  creationtime: new Date(),
  enabledstatus: false,
  // 觸發條件相關
  triggerMethod: '',
  triggerType: '',
  product: '',
  device: '',
  function: '',
  valueType: '',
  valuePeriod: '',
  judgeCondition: '',
  judgeValue: '',
  triggerTime: '',
  triggerWeekdays: [],
  // 動作相關
  httpHeaders: []
})



// 验证规则
const rule = reactive({
               scenename : [{
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
    if (searchInfo.value.enabledstatus === ""){
        searchInfo.value.enabledstatus=null
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
  const table = await getScenesList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const scenFormVisible = ref(false)

getTableData()

// ============== 表格控制部分结束 ===============

// 获取需要的字典 可能为空 按需保留
const setOptions = async () =>{
  TriggerModeOptions.value = await getDictFunc('TriggerMode')
  TriggerTypeOptions.value = await getDictFunc('TriggerType')
  DriveStatusOptions.value = await getDictFunc('driveStatus')
  JudgingCondition.value = await getDictFunc('judging_condition')
  ValueType.value = await getDictFunc('value_type')
  ValuePeriod.value = await getDictFunc('value_period')
  ActionType.value = await getDictFunc('ActionType')
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
            deleteScenesFunc(row)
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
      const res = await deleteScenesByIds({ IDs })
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

// 新增参数
const addParameter = (form) => {
  if (!form.httpHeaders) {
    form.httpHeaders = []
  }
  form.httpHeaders.push({
    key: '',
    value: ''
  })
}

// 删除参数
const deleteParameter = (parameters, index) => {
  parameters.splice(index, 1)
}

// 更新行
const updateScenesFunc = async(row) => {
    const res = await findScenes({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}

const scenesSwitchChanges=async (row) => {
  console.log(row)
  const res = await scenesSwitchChange({status: row.enabledstatus,id: row.ID})
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

// 删除行
const deleteScenesFunc = async (row) => {
    const res = await deleteScenes({ ID: row.ID })
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

const ScenesId=ref(0)

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
    scenFormVisible.value = false
    formData.value = {
      scenename: '',
      scenedescription: '',
      creationtime: new Date(),
      enabledstatus: false,
      // 觸發條件相關
      triggerMethod: '',
      triggerType: '',
      product: '',
      device: '',
      function: '',
      valueType: '',
      valuePeriod: '',
      judgeCondition: '',
      judgeValue: '',
      triggerTime: '',
      triggerWeekdays: [],
      // 動作相關
      httpHeaders: []
    }
}
// 弹窗确定
const enterDialog = async () => {
  btnLoading.value = true
  elFormRef.value?.validate(async (valid) => {
    if (!valid) return btnLoading.value = false
    let res
    switch (type.value) {
      case 'create':
        res = await createScenes(formData.value)
        break
      case 'update':
        res = await updateScenes(formData.value)
        break
      default:
        res = await createScenes(formData.value)
        break
    }
    btnLoading.value = false
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '創建/更改成功'
      })
      closeDialog()
      getTableData()
    }
  })
}

// 場景表單確定
const enterSceneDialog = async () => {
  btnLoading.value = true
  try {
    await elFormRef.value?.validate()
    let res
    const sceneData = {
      ...formData.value,
      triggerConfig: {
        method: formData.value.triggerMethod,
        type: formData.value.triggerType,
        time: formData.value.triggerTime,
        weekdays: formData.value.triggerWeekdays,
        product: formData.value.product,
        device: formData.value.device,
        function: formData.value.function,
        valueType: formData.value.valueType,
        valuePeriod: formData.value.valuePeriod,
        judgeCondition: formData.value.judgeCondition,
        judgeValue: formData.value.judgeValue
      },
      actions: formData.value.httpHeaders
    }

    switch (type.value) {
      case 'create':
        sceneData.ID = ScenesId.value
        res = await enterCreateScenes(sceneData)
        break
      case 'update':
        // 添加場景 ID
        sceneData.ID = ScenesId.value
        res = await enterUpdateScenes(sceneData)
        break
      default:
        sceneData.ID = ScenesId.value
        res = await enterCreateScenes(sceneData)
        break
    }
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '創建/更改成功'
      })
      closeDialog()
      getTableData()
    }
  } catch (error) {
    console.error('表單驗證失敗:', error)
  } finally {
    btnLoading.value = false
  }
}

const detailFrom = ref({})

// 查看详情控制标记
const detailShow = ref(false)

const dialogTitle = ref('编辑场景')
const addScen = (row) => {
  ScenesId.value=row.ID
  dialogTitle.value = '新增菜单'
  // isEdit.value = false
  setOptions()
  scenFormVisible.value = true
}

// 打开详情弹窗
const openDetailShow = () => {
  detailShow.value = true
}


// 打开详情
const getDetails = async (row) => {
  // 打开弹窗
  const res = await findScenes({ ID: row.ID })
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

const productOptions = ref([])
const productGroupMap = ref({})

const getGroup = async () => {
  const res = await getProductGroups()
  if (res.code === 0) {
    const groups = res.data
    productOptions.value = groups.map((item) => ({
      label: item.productName,
      value: item.productName
    }))
    productGroupMap.value = res.data.productGroupMap
  }
}

getGroup()

const deviceOptions = ref([])
const deviceGroupMap = ref({})

const getDeviceGroup = async (proId) => {
  const res = await getScenDevicesList({id: proId})
  if (res.code === 0) {
    const groups = res.data
    deviceOptions.value = groups.map((item) => ({
      label: item.drive_name,
      value: item.ID
    }))
    deviceGroupMap.value = res.data.deviceGroupMap
  }
}

const functionOptions = ref([])
const functionGroupMap = ref({})
const getScenFuncGroup = async (proId) => {
  const res = await getScenFuncList({id: proId})
  if (res.code === 0) {
    const groups = res.data
    functionOptions.value = groups.map((item) => ({
      label: item.drive_name,
      value: item.ID
    }))
    functionGroupMap.value = res.data.functionGroupMap
  }
}

const changeProduct=()=>{
  getDeviceGroup(formData.value.product)
  getScenFuncGroup(formData.value.product)
}

computed(() => {
  if (!formData.value.triggerMethod) {
    return 24
  }
  return 6
});
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