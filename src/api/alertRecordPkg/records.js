import service from '@/utils/request'
// @Tags Records
// @Summary 创建告警记录
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Records true "创建告警记录"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /records/createRecords [post]
export const createRecords = (data) => {
  return service({
    url: '/records/createRecords',
    method: 'post',
    data
  })
}

// @Tags Records
// @Summary 删除告警记录
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Records true "删除告警记录"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /records/deleteRecords [delete]
export const deleteRecords = (params) => {
  return service({
    url: '/records/deleteRecords',
    method: 'delete',
    params
  })
}

// @Tags Records
// @Summary 批量删除告警记录
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除告警记录"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /records/deleteRecords [delete]
export const deleteRecordsByIds = (params) => {
  return service({
    url: '/records/deleteRecordsByIds',
    method: 'delete',
    params
  })
}

// @Tags Records
// @Summary 更新告警记录
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Records true "更新告警记录"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /records/updateRecords [put]
export const updateRecords = (data) => {
  return service({
    url: '/records/updateRecords',
    method: 'put',
    data
  })
}

// @Tags Records
// @Summary 用id查询告警记录
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Records true "用id查询告警记录"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /records/findRecords [get]
export const findRecords = (params) => {
  return service({
    url: '/records/findRecords',
    method: 'get',
    params
  })
}

// @Tags Records
// @Summary 分页获取告警记录列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取告警记录列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /records/getRecordsList [get]
export const getRecordsList = (params) => {
  return service({
    url: '/records/getRecordsList',
    method: 'get',
    params
  })
}

// @Tags Records
// @Summary 不需要鉴权的告警记录接口
// @Accept application/json
// @Produce application/json
// @Param data query alertRecordPkgReq.RecordsSearch true "分页获取告警记录列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /records/getRecordsPublic [get]
export const getRecordsPublic = () => {
  return service({
    url: '/records/getRecordsPublic',
    method: 'get',
  })
}
