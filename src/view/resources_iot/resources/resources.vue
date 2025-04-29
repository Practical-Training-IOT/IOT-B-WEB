
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
      </el-form-item>
      

        <template v-if="showAllQuery">
          &lt;!&ndash; 将需要控制显示状态的查询条件添加到此范围内 &ndash;&gt;
        </template>

        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button icon="refresh" @click="onReset">重置</el-button>
          <el-button link type="primary" icon="arrow-down" @click="showAllQuery=true" v-if="!showAllQuery">展开</el-button>
          <el-button link type="primary" icon="arrow-up" @click="showAllQuery=false" v-else>收起</el-button>
        </el-form-item>-->

        <div class="page-header">
          <div class="page-header-content">
            <div class="page-header-title">
              <h1>资源管理</h1>
              <p>平台提供多种消息通信中间件资源，资源可作为规则引擎的消息目的地，通过创建资源快速将数据推送至应用平台。</p>
              <p>现在选择的协议是<span class="protocol-highlight">{{Agreement.name}}</span></p>
            </div>
            <div class="page-header-image">
              <!-- 这里使用一个占位符图片，你可以替换为实际的图片路径 -->
              <img src="@/assets/resources.svg" alt="资源管理背景图">
            </div>
          </div>
        </div>

      </el-form>
    </div>
    <div class="gva-table-box">

<!--      展示协议-->

      <div class="order-type-buttons">
        <!-- 循环生成按钮 -->
        <el-button
            v-for="(item, key) in AgreementTypeOptions"
            :key="key"
            :type="searchInfo.value === item.value? 'primary' : 'default'"
            @click="() => onAgreementSubmit(item.value)"
        >
          {{ item.label }}
        </el-button>
      </div>

      <br>

        <div class="gva-btn-list">
            <el-button v-auth="btnAuth.add" type="primary" icon="plus" @click="openDialog()">新增</el-button>
            <el-button v-auth="btnAuth.batchDelete" icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="onDelete">删除</el-button>
            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="resources_iot_Resources" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="resources_iot_Resources" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="resources_iot_Resources" @on-success="getTableData" />
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
        
            <el-table-column align="left" label="资源名称" prop="name" width="120" />

          <el-table-column sortable align="left" label="日期" prop="CreatedAt" width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
          </el-table-column>

<!--            <el-table-column align="left" label="协议类型" prop="protocolType" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.protocolType,AgreementTypeOptions) }}
    </template>
</el-table-column>-->
            <el-table-column align="left" label="资源状态" prop="status" width="120">
    <template #default="scope">
    {{ filterDict(scope.row.status,ResourceStatusOptions) }}
    </template>
</el-table-column>
        <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
            <el-button  v-auth="btnAuth.delete" type="primary" link icon="delete" @click="check(scope.row)">验证</el-button>
            <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
            <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateResourcesFunc(scope.row)">编辑</el-button>
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

<!--          HTTP-->

      <el-form :model="formData" label-position="top" ref="elFormRef" :rules="rule" label-width="80px" v-if="Agreement.name==='HTTP'">
        <el-form-item label="实例名称:" prop="instanceName">
          <el-input v-model="formData.instanceName" :clearable="true" placeholder="请输入实例名称" />
        </el-form-item>
        <el-form-item label="URL:" prop="url">
          <el-input v-model="formData.url" :clearable="true" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="HTTP method:" prop="httpMethod">
          <el-select v-model="formData.httpMethod" placeholder="请选择HTTP method" style="width:100%" filterable :clearable="true">
            <el-option v-for="(item,key) in HTTPMethodOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Body type:" prop="bodyType">
          <el-select v-model="formData.bodyType" placeholder="请选择BodyType" style="width:100%" filterable :clearable="true">
            <el-option v-for="(item,key) in BodyTypeOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Timeout(ms):" prop="timeout">
          <el-input v-model="formData.timeout" :clearable="true" placeholder="请输入Timeout(ms)" />
        </el-form-item>

        <div class="flex items-center gap-2">
          <el-button type="primary" icon="edit" @click="addParameter(formData)">
            新增HTTP headers
          </el-button>
        </div>
        <el-table :data="formData.httpHeaders" style="width: 100%; margin-top: 12px">
          <el-table-column align="left" prop="key" label="key" width="180">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.key" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="value" label="value">
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
<!--                    <el-form-item label="协议类型:" prop="protocolType">
              <el-select v-model="formData.protocolType" placeholder="请选择协议类型" style="width:100%" filterable :clearable="true">
            <el-option v-for="(item,key) in AgreementTypeOptions" :key="key" :label="item.label" :value="item.value" />
            </el-select>
            </el-form-item>
            <el-form-item label="资源状态:" prop="status">
            <el-select v-model="formData.status" placeholder="请选择资源状态" style="width:100%" filterable :clearable="true">
            <el-option v-for="(item,key) in ResourceStatusOptions" :key="key" :label="item.label" :value="item.value" />
            </el-select>
            </el-form-item>-->
      </el-form>


<!--      Kafka-->
      <el-form :model="formData" label-position="top" ref="elFormRef" :rules="rule" label-width="80px" v-if="Agreement.name==='Kafka'">
        <el-form-item label="实例名称:" prop="instanceName">
          <el-input v-model="formData.instanceName" :clearable="true" placeholder="请输入实例名称" />
        </el-form-item>
        <el-form-item label="Kafka brokers:" prop="brokers">
          <el-input v-model="formData.brokers" :clearable="true" placeholder="请输入Kafka brokers" />
        </el-form-item>
        <el-form-item label="Topic:" prop="topic">
          <el-input v-model="formData.topic" :clearable="true" placeholder="请输入Topic" />
        </el-form-item>
        <el-form-item label="SaslAuthType:" prop="saslAuthType">
          <el-input v-model="formData.saslAuthType" :clearable="true" placeholder="请输入SaslAuthType" />
        </el-form-item>
        <el-form-item label="SaslUserName:" prop="saslUserName">
          <el-input v-model="formData.saslUserName" :clearable="true" placeholder="请输入SaslUserName" />
        </el-form-item>
        <el-form-item label="SaslPassword:" prop="saslPassword">
          <el-input v-model="formData.saslPassword" :clearable="true" placeholder="请输入SaslPassword" show-password />
        </el-form-item>
      </el-form>

      <!--      MQTT-->
      <el-form :model="formData" label-position="top" ref="elFormRef" :rules="rule" label-width="80px" v-if="Agreement.name==='MQTT'">
        <el-form-item label="实例名称:" prop="instanceName">
          <el-input v-model="formData.instanceName" :clearable="true" placeholder="请输入实例名称" />
        </el-form-item>
        <el-form-item label="MQTT broker address:" prop="brokerAddress">
          <el-input v-model="formData.brokerAddress" :clearable="true" placeholder="请输入MQTT broker address" />
        </el-form-item>
        <el-form-item label="MQTT topic:" prop="mqttTopic">
          <el-input v-model="formData.mqttTopic" :clearable="true" placeholder="请输入MQTT topic" />
        </el-form-item>
        <el-form-item label="MQTT client:" prop="mqttClient">
          <el-input v-model="formData.mqttClient" :clearable="true" placeholder="请输入MQTT client" />
        </el-form-item>
        <el-form-item label="MQTT protocol version:" prop="protocolVersion">
          <el-input v-model="formData.protocolVersion" :clearable="true" placeholder="请输入MQTT protocol version" />
        </el-form-item>
        <el-form-item label="QoS:" prop="qos">
          <el-input v-model="formData.qos" :clearable="true" placeholder="请输入QoS" />
        </el-form-item>
        <el-form-item label="Username:" prop="username">
          <el-input v-model="formData.username" :clearable="true" placeholder="请输入Username" />
        </el-form-item>
        <el-form-item label="Password:" prop="password">
          <el-input v-model="formData.password" :clearable="true" placeholder="请输入Password" show-password />
        </el-form-item>
      </el-form>
    </el-drawer>

<!--    HTTP-->

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看" v-if="Agreement.name==='HTTP'">
            <el-descriptions :column="1" border>
                    <el-descriptions-item label="实例名称">
                      {{ detailFrom.instanceName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="URL">
                      {{ detailFrom.url }}
                    </el-descriptions-item>
                    <el-descriptions-item label="请求方式">
                      {{ detailFrom.httpMethod }}
                    </el-descriptions-item>
                    <el-descriptions-item label="结构类型">
                      {{ detailFrom.bodyType }}
                    </el-descriptions-item>
                    <el-descriptions-item label="超时时间">
                      {{ detailFrom.timeout }}
                    </el-descriptions-item>
            </el-descriptions>
    </el-drawer>


    <!--    Kafka-->

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看" v-if="Agreement.name==='Kafka'">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="实例名称">
          {{ detailFrom.instanceName }}
        </el-descriptions-item>
        <el-descriptions-item label="brokers">
          {{ detailFrom.brokers }}
        </el-descriptions-item>
        <el-descriptions-item label="topic">
          {{ detailFrom.topic }}
        </el-descriptions-item>
        <el-descriptions-item label="saslAuthType">
          {{ detailFrom.saslAuthType }}
        </el-descriptions-item>
        <el-descriptions-item label="saslUserName">
          {{ detailFrom.saslUserName }}
        </el-descriptions-item>
        <el-descriptions-item label="saslPassword">
          {{ detailFrom.saslPassword }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>


    <!--    MQTT-->

    <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看" v-if="Agreement.name==='MQTT'">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="实例名称">
          {{ detailFrom.instanceName }}
        </el-descriptions-item>
        <el-descriptions-item label="brokerAddress">
          {{ detailFrom.brokerAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="mqttTopic">
          {{ detailFrom.mqttTopic }}
        </el-descriptions-item>
        <el-descriptions-item label="mqttClient">
          {{ detailFrom.mqttClient }}
        </el-descriptions-item>
        <el-descriptions-item label="qos">
          {{ detailFrom.qos }}
        </el-descriptions-item>
        <el-descriptions-item label="username">
          {{ detailFrom.username }}
        </el-descriptions-item>
        <el-descriptions-item label="password">
          {{ detailFrom.password }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>

  </div>
</template>

<script setup>
import {
  createResources,
  deleteResources,
  deleteResourcesByIds,
  updateResources,
  findResources,
  getResourcesList, getResourcesCheck
} from '@/api/resources_iot/resources'

// 全量引入格式化工具 请按需保留
import { getDictFunc, formatDate, filterDict  } from '@/utils/format'
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


// 协议常量

const Agreement=ref({
  name: 'HTTP',
})

const Id=ref(0)

defineOptions({
    name: 'Resources'
})
// 按钮权限实例化
    const btnAuth = useBtnAuth()

// 提交按钮loading
const btnLoading = ref(false)
const appStore = useAppStore()

/*// 控制更多查询条件显示/隐藏状态
const showAllQuery = ref(false)*/

// 自动化生成的字典（可能为空）以及字段
const ResourceStatusOptions = ref([])
const AgreementTypeOptions = ref([])
const HTTPMethodOptions = ref([])
const BodyTypeOptions = ref([])
const formData = ref({
  instanceName: '', // 实例名称
  url: '', // URL (HTTP)
  httpMethod: '', // HTTP Method (HTTP)
  bodyType: '', // Body Type (HTTP)
  timeout: '', // Timeout (HTTP)
  brokers: '', // Kafka Brokers (Kafka)
  topic: '', // Topic (Kafka)
  saslAuthType: '', // Sasl Auth Type (Kafka)
  saslUserName: '', // Sasl User Name (Kafka)
  saslPassword: '', // Sasl Password (Kafka)
  brokerAddress: '', // Broker Address (MQTT)
  mqttTopic: '', // MQTT Topic (MQTT)
  mqttClient: '', // MQTT Client (MQTT)
  protocolVersion: '', // Protocol Version (MQTT)
  qos: '', // QoS (MQTT)
  username: '', // Username (MQTT)
  password: '', // Password (MQTT)
  httpHeaders:[{
    key: '',
    value: ''
  }]
})



// 验证规则
const rule = reactive({
               name : [{
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
/*// 重置
const onReset = () => {
  searchInfo.value = {}
  getTableData()
}*/

// 搜索
const onSubmit = () => {
  elSearchFormRef.value?.validate(async(valid) => {
    if (!valid) return
    page.value = 1
    getTableData()
  })
}

const onAgreementSubmit = (value) => {
  Agreement.value.name=value
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
  const table = await getResourcesList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value ,
    name: Agreement.value.name
  })
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
    ResourceStatusOptions.value = await getDictFunc('ResourceStatus')
    AgreementTypeOptions.value = await getDictFunc('AgreementType')
    HTTPMethodOptions.value = await getDictFunc('HTTPMethod')
    BodyTypeOptions.value = await getDictFunc('BodyType')
}

// 获取需要的字典 可能为空 按需保留
setOptions()


// 多选数据
const multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

const check=async (row) => {
  const res = await getResourcesCheck({id:row.ID,name:Agreement.value.name})
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '验证成功'
    })
    getTableData()
  }
}

// 删除行
const deleteRow = (row) => {
    ElMessageBox.confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
            deleteResourcesFunc(row)
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
      const res = await deleteResourcesByIds({ IDs })
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
const updateResourcesFunc = async(row) => {
    const res = await findResources({ ID: row.ID })
    Id.value=row.ID
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteResourcesFunc = async (row) => {
    const res = await deleteResources({ ID: row.ID })
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
      instanceName: '', // 实例名称
      url: '', // URL (HTTP)
      httpMethod: '', // HTTP Method (HTTP)
      bodyType: '', // Body Type (HTTP)
      timeout: '', // Timeout (HTTP)
      brokers: '', // Kafka Brokers (Kafka)
      topic: '', // Topic (Kafka)
      saslAuthType: '', // Sasl Auth Type (Kafka)
      saslUserName: '', // Sasl User Name (Kafka)
      saslPassword: '', // Sasl Password (Kafka)
      brokerAddress: '', // Broker Address (MQTT)
      mqttTopic: '', // MQTT Topic (MQTT)
      mqttClient: '', // MQTT Client (MQTT)
      protocolVersion: '', // Protocol Version (MQTT)
      qos: '', // QoS (MQTT)
      username: '', // Username (MQTT)
      password: '', // Password (MQTT)
      httpHeaders:[{
        key: '',
        value: ''
      }]
        }
}

function prepareRequestData(formData, protocolType) {
  if (type.value === 'create') {
    const requestData = {
      instance_name: formData.instanceName,
      protocol_type: protocolType,
      config: {} // 协议特定配置
    };

    switch (protocolType) {
      case 'HTTP':
        requestData.config = {
          url: formData.url,
          http_method: formData.httpMethod,
          body_type: formData.bodyType,
          timeout: parseInt(formData.timeout, 10) || 0,
          httpHeaders: formData.httpHeaders
        };
        break;

      case 'Kafka':
        requestData.config = {
          brokers: formData.brokers,
          topic: formData.topic,
          sasl_auth_type: formData.saslAuthType,
          sasl_user_name: formData.saslUserName,
          sasl_password: formData.saslPassword
        };
        break;

      case 'MQTT':
        requestData.config = {
          broker_address: formData.brokerAddress,
          mqtt_topic: formData.mqttTopic,
          mqtt_client: formData.mqttClient,
          protocol_version: formData.protocolVersion,
          qos: parseInt(formData.qos, 10) || 0,
          username: formData.username,
          password: formData.password
        };
        break;

      default:
        throw new Error('Unsupported protocol type');
    }

    return requestData;
  } else if (type.value === 'update') {

    const requestData = {
      id:Id.value,
      instance_name: formData.instanceName,
      protocol_type: protocolType,
      config: {} // 协议特定配置
    };

    switch (protocolType) {
      case 'HTTP':
        requestData.config = {
          url: formData.url,
          http_method: formData.httpMethod,
          body_type: formData.bodyType,
          timeout: parseInt(formData.timeout, 10) || 0,
          httpHeaders: formData.httpHeaders
        };
        break;

      case 'Kafka':
        requestData.config = {
          brokers: formData.brokers,
          topic: formData.topic,
          sasl_auth_type: formData.saslAuthType,
          sasl_user_name: formData.saslUserName,
          sasl_password: formData.saslPassword
        };
        break;

      case 'MQTT':
        requestData.config = {
          broker_address: formData.brokerAddress,
          mqtt_topic: formData.mqttTopic,
          mqtt_client: formData.mqttClient,
          protocol_version: formData.protocolVersion,
          qos: parseInt(formData.qos, 10) || 0,
          username: formData.username,
          password: formData.password
        };
        break;

      default:
        throw new Error('Unsupported protocol type');
    }

    return requestData;
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
                {
                  const pore =prepareRequestData(formData.value,Agreement.value.name)
                  res = await createResources(pore)
                  break
                }
                case 'update':
                {
                  const pore =prepareRequestData(formData.value,Agreement.value.name)
                  res = await updateResources(pore)
                  break
                }
                default:
                {
                  const pore =prepareRequestData(formData.value,Agreement.value.name)
                  res = await createResources(pore)
                  break
                }
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
  const res = await findResources({ ID: row.ID})
  console.log(res)
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
</style>