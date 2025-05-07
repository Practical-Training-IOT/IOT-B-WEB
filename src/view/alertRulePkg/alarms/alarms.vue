
<template>
  <div>
    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="规则名称">
          {{ detailFrom.ruleName }}
        </el-descriptions-item>
        <el-descriptions-item label="告警类型">
          {{ detailFrom.alarmType }}
        </el-descriptions-item>
        <el-descriptions-item label="告警级别">
          {{ detailFrom.alarmLevel }}
        </el-descriptions-item>
        <el-descriptions-item label="规则描述">
          <div style="width: 300px; height: 300px;">
            <div ref="alarmChart" style="width: 100%; height: 100%;"></div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
    <div class="gva-search-box">
      <el-form ref="elSearchFormRef" :inline="true" :model="searchInfo" class="demo-form-inline" :rules="searchRule" @keyup.enter="onSubmit">
      <el-form-item label="创建日期" prop="CreatedAt">
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
        
        <el-table-column sortable align="left" label="日期" prop="CreatedAt"width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column>
        
            <el-table-column align="left" label="规则名称" prop="ruleName" width="120" />

            <el-table-column align="left" label="告警类型" prop="alarmType" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.alarmType,alert_typeOptions) }}
    </template>
</el-table-column>
            <el-table-column align="left" label="告警级别" prop="alarmLevel" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.alarmLevel,alert_levelOptions) }}
    </template>
</el-table-column>
            <el-table-column label="规则描述" prop="ruleDescription" width="200">
   <template #default="scope">
      [富文本内容]
   </template>
</el-table-column>
            <el-table-column align="left" label="状态" prop="status" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.status,Rule_statusOptions) }}
    </template>
</el-table-column>
        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateAlarmsFunc(scope.row)">编辑</el-button>
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
            <el-form-item label="规则名称:" prop="ruleName">
    <el-input v-model="formData.ruleName" :clearable="true" placeholder="请输入规则名称" />
</el-form-item>
            <el-form-item label="告警类型:" prop="alarmType">
    <el-select v-model="formData.alarmType" placeholder="请选择告警类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in alert_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
            <el-form-item label="告警级别:" prop="alarmLevel">
    <el-select v-model="formData.alarmLevel" placeholder="请选择告警级别" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in alert_levelOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
            <el-form-item label="规则描述:" prop="ruleDescription">
    <RichEdit v-model="formData.ruleDescription"/>
</el-form-item>
            <el-form-item label="触发方式:" prop="triggerMode">
    <el-select v-model="formData.triggerMode" placeholder="请选择触发方式" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in trigger_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
            <el-form-item label="产品:"  prop="product" >
              <el-select v-model="formData.product" @change="getEquipment(formData.product)" clearable placeholder="选择产品">
                <el-option
                    v-for="item in apiProductOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备:"  prop="equipment" >
              <el-select v-model="formData.equipment" clearable placeholder="选择设备">
                <el-option
                    v-for="item in apiEquipmentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="取值类型:" prop="valueType">
    <el-select v-model="formData.valueType" placeholder="请选择取值类型" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in value_typeOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item >
            <el-form-item label="取值周期:" prop="valuePeriod" v-if="formData.valueType !== 'original value'"
            >
    <el-select v-model="formData.valuePeriod" placeholder="请选择取值周期" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in value_periodOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
            <el-form-item label="判断条件:" prop="judgingCondition">
    <el-select v-model="formData.judgingCondition" placeholder="请选择判断条件" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in judging_conditionOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
            <el-form-item label="取值:" prop="value">
    <el-input v-model="formData.value" :clearable="true" placeholder="请输入取值" />
</el-form-item>
            <el-form-item label="静默时间:" prop="silencePeriod">
    <el-select v-model="formData.silencePeriod" placeholder="请选择静默时间" style="width:100%" filterable :clearable="true">
        <el-option v-for="(item,key) in silence_periodOptions" :key="key" :label="item.label" :value="item.value" />
    </el-select>
</el-form-item>
            <el-form-item label="通知方式:" prop="meanNotification">
              <el-select v-model="formData.meanNotification" placeholder="请选择状态" style="width:100%" filterable :clearable="true">
                <el-option v-for="(item,key) in mean_notificationOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态:" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width:100%" filterable :clearable="true">
                <el-option v-for="(item,key) in Rule_statusOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
    </el-drawer>

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
            <el-descriptions :column="1" border>
                    <el-descriptions-item label="规则名称">
    {{ detailFrom.ruleName }}
</el-descriptions-item>
                    <el-descriptions-item label="告警类型">
    {{ detailFrom.alarmType }}
</el-descriptions-item>
                    <el-descriptions-item label="告警级别">
    {{ detailFrom.alarmLevel }}
</el-descriptions-item>
                    <el-descriptions-item label="规则描述">
    <RichView v-model="detailFrom.ruleDescription" />
</el-descriptions-item>
                    <el-descriptions-item label="触发方式">
    {{ detailFrom.triggerMode }}
</el-descriptions-item>
                    <el-descriptions-item label="取值类型">
    {{ detailFrom.valueType }}
</el-descriptions-item>
                    <el-descriptions-item label="取值周期">
    {{ detailFrom.valuePeriod }}
</el-descriptions-item>
                    <el-descriptions-item label="判断条件">
    {{ detailFrom.judgingCondition }}
</el-descriptions-item>
                    <el-descriptions-item label="取值">
    {{ detailFrom.value }}
</el-descriptions-item>
                    <el-descriptions-item label="静默时间">
    {{ detailFrom.silencePeriod }}
</el-descriptions-item>
                    <el-descriptions-item label="通知方式">
    {{ detailFrom.meanNotification }}
</el-descriptions-item>
                    <el-descriptions-item label="状态">
    {{ detailFrom.status }}
</el-descriptions-item>
            </el-descriptions>
        </el-drawer>

  </div>
</template>

<script setup>
import {
  createAlarms,
  deleteAlarms,
  deleteAlarmsByIds,
  updateAlarms,
  findAlarms,
  getAlarmsList,
  getAllProductList,
  getEquipmentList
} from '@/api/alertRulePkg/alarms'
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




defineOptions({
    name: 'Alarms'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)

// 自动化生成的字典（可能为空）以及字段
const judging_conditionOptions = ref([])
const mean_notificationOptions = ref([])
const alert_typeOptions = ref([])
const silence_periodOptions = ref([])
const Rule_statusOptions = ref([])
const alert_levelOptions = ref([])
const trigger_typeOptions = ref([])
const value_typeOptions = ref([])
const value_periodOptions = ref([])
const apiProductOptions =ref([])
const apiProductMap = ref([])
const apiEquipmentOptions =ref([])
const apiEquipmentMap = ref([])

const formData = ref({
            ruleName: '',
            alarmType: '',
            alarmLevel: '',
            ruleDescription: '',
            triggerMode: '',
            valueType: '',
            valuePeriod: '',
            judgingCondition: '',
            value: '',
            silencePeriod: '',
            meanNotification: '',
            status: '',
            product: '',
            equipment: '',
        })



// 验证规则
const rule = reactive({
               ruleName : [{
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
               alarmType : [{
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
               alarmLevel : [{
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
               triggerMode : [{
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
               valueType : [{
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
               valuePeriod : [{
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
               judgingCondition : [{
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
               value : [{
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
let productId =0
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
  const table = await getAlarmsList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

getTableData()

const getProductData = async() => {
  const res = await getAllProductList()
  if (res.code === 0) {
    console.log(res.data,res)
    const groups = res.data.list
    apiProductOptions.value = groups.map((item) => ({
      label: item.productName,
      value: item.ID
    }))
    apiProductMap.value = res.data.apiProductMap
  }
}

getProductData()

// 获取设备列表

const getEquipment = async (id) => {
  productId=id
};

const getEquipmentData = async() => {
  const res = await getEquipmentList(productId)
  if (res.code === 0) {
    console.log(res.data, res)

    // 将单个设备对象转换为选项数组
    apiEquipmentOptions.value = [{
      label: res.data.drive_name,  // 使用 drive_name 作为显示标签
      value: res.data.ID           // 使用 ID 作为值
    }]

    // 如果你需要映射信息，可能需要从其他地方获取
    // 因为返回数据中没有 apiEquipmentMap 字段
    apiEquipmentMap.value = {
      [res.data.ID]: res.data // 或者根据你的需求创建映射
    }
  }
}

getEquipmentData()

// ============== 表格控制部分结束 ===============

// 获取需要的字典 可能为空 按需保留
const setOptions = async () =>{
    judging_conditionOptions.value = await getDictFunc('judging_condition')
    mean_notificationOptions.value = await getDictFunc('mean_notification')
    alert_typeOptions.value = await getDictFunc('alert_type')
    silence_periodOptions.value = await getDictFunc('silence_period')
    Rule_statusOptions.value = await getDictFunc('Rule_status')
    alert_levelOptions.value = await getDictFunc('alert_level')
    trigger_typeOptions.value = await getDictFunc('trigger_type')
    value_typeOptions.value = await getDictFunc('value_type')
    value_periodOptions.value = await getDictFunc('value_period')
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
            deleteAlarmsFunc(row)
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
      const res = await deleteAlarmsByIds({ IDs })
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
const updateAlarmsFunc = async(row) => {
    const res = await findAlarms({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteAlarmsFunc = async (row) => {
    const res = await deleteAlarms({ ID: row.ID })
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
        ruleName: '',
        alarmType: '',
        alarmLevel: '',
        ruleDescription: '',
        triggerMode: '',
        valueType: '',
        valuePeriod: '',
        judgingCondition: '',
        value: '',
        silencePeriod: '',
        meanNotification: '',
        status: '',
        product: '',
        equipment: '',
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
                  res = await createAlarms(formData.value)
                  break
                case 'update':
                  res = await updateAlarms(formData.value)
                  break
                default:
                  res = await createAlarms(formData.value)
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
  const res = await findAlarms({ ID: row.ID })
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
