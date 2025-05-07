<template>

<!--  <div class="product-management-container">
    <div class="content">
      <h2>驱动镜像</h2>
      <p>驱动镜像是用户编写程序最终打包成可下载的docker镜像，它是实体设备与物联网平台通讯的桥梁，所有的设备数据和控制指令由物联网平台下发给驱动。</p>
    </div>
    <div class="image"></div>
  </div>-->
  <div>
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-header-title">
          <h2>驱动镜像</h2>
          <p>驱动镜像是用户编写程序最终打包成可下载的docker镜像，它是实体设备与物联网平台通讯的桥梁，所有的设备数据和控制指令由物联网平台下发给驱动。</p>
        </div>
        <div  class="page-header-image"><img src="@/assets/resources.svg" alt="资源管理背景图"></div>
      </div>
    </div>

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
      
            <el-form-item label="驱动名称" prop="driver_name">
  <el-input v-model="searchInfo.driver_name" placeholder="搜索条件" />
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
<!--这里-->
<!--      <div>
        <el-form-item label="" prop="driver_type">
          <el-radio-group v-model="formData.driver_type" style="width:100%">
            <el-radio-button v-for="(item, key) in drive_typeOptions" :key="key" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>-->
      <div>
        <el-form-item label="驱动类型:" prop="driver_type">
          <el-radio-group v-model="formData.driver_type" style="width:100%">
            <!-- 使用 slice 方法仅遍历前两个选项 -->
            <el-radio-button
                v-for="(item, key) in drive_typeOptions.slice(0, 2)"
                :key="key"
                :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
         </el-radio-group>
        </el-form-item>
    </div>
        <div class="gva-btn-list">
            <el-button v-auth="btnAuth.add" type="primary" icon="plus" @click="openDialog()">新增</el-button>
<!--            <el-button v-auth="btnAuth.batchDelete" icon="delete" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="onDelete">删除</el-button>
            <ExportTemplate v-auth="btnAuth.exportTemplate" template-id="driverPkg_Drivers" />
            <ExportExcel v-auth="btnAuth.exportExcel" template-id="driverPkg_Drivers" filterDeleted/>
            <ImportExcel v-auth="btnAuth.importExcel" template-id="driverPkg_Drivers" @on-success="getTableData" />-->
        </div>

      <div v-if="formData.driver_type === '1'">

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

          <el-table-column align="left" label="镜像编号" prop="mirror_number" width="370" />

          <el-table-column align="left" label="驱动名称" prop="driver_name" width="120" />

          <el-table-column align="left" label="驱动类型" prop="driver_type" width="120">
            <template #default="scope">
              {{ filterDict(scope.row.driver_type,drive_typeOptions) }}
            </template>
          </el-table-column>


          <el-table-column align="left" label="协议" prop="agreement" width="120">
            <template #default="scope">
              {{ filterDict(scope.row.agreement,gatewayProtocolOptions) }}
            </template>
          </el-table-column>
          <el-table-column align="left" label="镜像仓库地址" prop="mirror_address" width="120" />

          <el-table-column align="left" label="驱动标识" prop="driver_identification" width="120" />

          <el-table-column align="left" label="版本" prop="version" width="120" />

          <!--            <el-table-column label="描述" prop="description" width="200">
             <template #default="scope">
                [富文本内容]
             </template>
          </el-table-column>-->
          <el-table-column align="left" label="操作" fixed="right" :min-width="appStore.operateMinWith">
            <template #default="scope">
              <el-button v-auth="btnAuth.info" type="primary" link class="table-button" @click="getDetails(scope.row)"><el-icon style="margin-right: 5px"><InfoFilled /></el-icon>查看</el-button>
              <el-button v-auth="btnAuth.edit" type="primary" link icon="edit" class="table-button" @click="updateDriversFunc(scope.row)">编辑</el-button>
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
          <el-form-item label="驱动名称:" prop="driver_name">
            <el-input v-model="formData.driver_name" :clearable="true" placeholder="请输入驱动名称" />
          </el-form-item>
<!--          <el-form-item label="驱动类型:" prop="driver_type">
            <el-select v-model="formData.driver_type" placeholder="请选择驱动类型" style="width:100%" filterable :clearable="true">
              <el-option v-for="(item,key) in drive_typeOptions" :key="key" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>-->
<!--          <el-form-item label="镜像编号:" prop="mirror_number">
            <el-input v-model="formData.mirror_number" :clearable="true" placeholder="请输入镜像编号" />
          </el-form-item>-->
          <el-form-item label="协议:" prop="agreement">
            <el-select v-model="formData.agreement" placeholder="请选择协议" style="width:100%" filterable :clearable="true">
              <el-option v-for="(item,key) in gatewayProtocolOptions" :key="key" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="镜像仓库地址:" prop="mirror_address">
            <el-input v-model="formData.mirror_address" :clearable="true" placeholder="请输入镜像仓库地址" />
          </el-form-item>
          <el-form-item label="驱动标识:" prop="driver_identification">
            <el-input v-model="formData.driver_identification" :clearable="true" placeholder="请输入驱动标识" />
          </el-form-item>
          <el-form-item label="版本:" prop="version">
            <el-input v-model="formData.version" :clearable="true" placeholder="请输入版本" />
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <RichEdit v-model="formData.description"/>
          </el-form-item>
        </el-form>
      </el-drawer>

      <el-drawer destroy-on-close :size="appStore.drawerSize" v-model="detailShow" :show-close="true" :before-close="closeDetailShow" title="查看">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="驱动名称">
            {{ detailFrom.driver_name }}
          </el-descriptions-item>
          <el-descriptions-item label="驱动类型">
            {{ detailFrom.driver_type }}
          </el-descriptions-item>
          <el-descriptions-item label="镜像编号">
            {{ detailFrom.mirror_number }}
          </el-descriptions-item>
          <el-descriptions-item label="协议">
            {{ detailFrom.agreement }}
          </el-descriptions-item>
          <el-descriptions-item label="镜像仓库地址">
            {{ detailFrom.mirror_address }}
          </el-descriptions-item>
          <el-descriptions-item label="驱动标识">
            {{ detailFrom.driver_identification }}
          </el-descriptions-item>
          <el-descriptions-item label="版本">
            {{ detailFrom.version }}
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            <RichView v-model="detailFrom.description" />
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>

      </div>

    <div v-if="formData.driver_type === '2'">
<!--      <div>
        <el-form-item label="" prop="driver_type">
          <el-radio-group v-model="formData.driver_type" style="width:100%">
            <el-radio-button v-for="(item, key) in drive_typeOptions" :key="key" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>-->
      <div>
        <el-form-item label="" prop="driver_type">
          <el-radio-group v-model="formData.test_false" style="width:100%">
            <!-- 使用 slice 方法跳过前两个选项 -->
            <el-radio-button
                v-for="(item, key) in drive_typeOptions.slice(2)"
                :key="key"
                :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="formData.test_false === '3'">
        <div class="protocol-cards-container">
          <div class="protocol-card" v-for="(protocol, index) in protocolList" :key="index" @click="selectProtocol(protocol)">
            <div class="protocol-header">
              <div class="protocol-actions">
                <el-button type="primary" size="small" class="download-btn">已下载</el-button>
                <el-button type="warning" size="small" class="open-btn">开源</el-button>
                <el-button type="success" size="small" class="version-btn">2.0版本</el-button>
              </div>
            </div>
            <div class="protocol-content">
              <img :src="protocol.icon" :alt="protocol.name" class="protocol-icon">
              <h3 class="protocol-name">{{ protocol.name }}</h3>
            </div>
            <div class="protocol-footer">
              <el-button type="primary" link @click="openManual(protocol.type)">手册</el-button>
            </div>
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>
import {
  createDrivers,
  deleteDrivers,
  deleteDriversByIds,
  updateDrivers,
  findDrivers,
  getDriversList
} from '@/api/driverPkg/drivers'
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
// 导入图片
import UIGB from '@/assets/gb28181.png'
import UIMO from '@/assets/modbus.png'
import UITC from '@/assets/tcp.png'
import UIHT from '@/assets/http.png'
import UIMQ from '@/assets/mqtt.png'
defineOptions({
    name: 'Drivers'
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
const gatewayProtocolOptions = ref([])
const formData = ref({
            driver_name: '',
            driver_type: '1',
            mirror_number: '',
            agreement: '',
            mirror_address: '',
            driver_identification: '',
            version: '',
            description: '',
            test_false:'3',
        })



// 验证规则
const rule = reactive({
               driver_name : [{
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
               agreement : [{
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
               mirror_address : [{
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
               driver_identification : [{
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
               version : [{
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
  const table = await getDriversList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
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
    gatewayProtocolOptions.value = await getDictFunc('gatewayProtocol')
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
            deleteDriversFunc(row)
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
      const res = await deleteDriversByIds({ IDs })
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
const updateDriversFunc = async(row) => {
    const res = await findDrivers({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteDriversFunc = async (row) => {
    const res = await deleteDrivers({ ID: row.ID })
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
        driver_name: '',
        driver_type: '1',
        mirror_number: '',
        agreement: '',
        mirror_address: '',
        driver_identification: '',
        version: '',
        description: '',
        test_false:'3',
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
                  res = await createDrivers(formData.value)
                  break
                case 'update':
                  res = await updateDrivers(formData.value)
                  break
                default:
                  res = await createDrivers(formData.value)
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
  const res = await findDrivers({ ID: row.ID })
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

// 协议列表数据
const protocolList = ref([
  {
    name: 'GB28181协议驱动',
    icon: UIGB,
    type: 'gb28181',
  },
  {
    name: 'MODBUS TCP协议驱动',
    icon: UIMO,
    type: 'modbus'
  },
  {
    name: 'TCP协议驱动',
    icon: UITC,
    type: 'tcp'
  },
  {
    name: 'HTTP协议驱动',
    icon: UIHT,
    type: 'http'
  },
  {
    name: 'MQTT协议驱动',
    icon: UIMQ,
    type: 'mqtt'
  }
])

// 选择协议
const selectProtocol = (protocol) => {
  // 这里可以处理协议选择的逻辑
  console.log('Selected protocol:', protocol)
}

// 打开协议手册
const openManual = (type) => {
  const manualUrls = {
    'gb28181': 'https://doc.hummingbird.winc-link.com/guide/use-cases/access/gb28181-protocol.html',
    'modbus': 'https://doc.hummingbird.winc-link.com/guide/use-cases/access/modbus-protocol.html',
    'tcp': 'https://doc.hummingbird.winc-link.com/guide/use-cases/access/tcp-protocol.html',
    'http': 'https://doc.hummingbird.winc-link.com/guide/use-cases/access/http-protocol.html',
    'mqtt': 'https://doc.hummingbird.winc-link.com/guide/use-cases/access/mqtt-protocol.html'
  }
  const url = manualUrls[type]
  if (url) {
    window.open(url, '_blank')
  }
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

.protocol-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.protocol-card {
  width: 250px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.protocol-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.protocol-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.protocol-actions {
  display: flex;
  gap: 8px;
}

.protocol-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
}

.protocol-icon {
  width: 300px;
  height: 200px;
  object-fit: contain;
  margin-bottom: 15px;
}

.protocol-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.protocol-footer {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.download-btn {
  background-color: #409EFF;
  color: white;
}

.open-btn {
  background-color: #E6A23C;
  color: white;
}

.version-btn {
  background-color: #67C23A;
  color: white;
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
