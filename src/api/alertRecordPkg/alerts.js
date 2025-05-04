import service from '@/utils/request'
// @Tags Alerts
// @Summary 创建alerts表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Alerts true "创建alerts表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /alerts/createAlerts [post]
export const createAlerts = (data) => {
  return service({
    url: '/alerts/createAlerts',
    method: 'post',
    data
  })
}

// @Tags Alerts
// @Summary 删除alerts表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Alerts true "删除alerts表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /alerts/deleteAlerts [delete]
export const deleteAlerts = (params) => {
  return service({
    url: '/alerts/deleteAlerts',
    method: 'delete',
    params
  })
}

// @Tags Alerts
// @Summary 批量删除alerts表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除alerts表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /alerts/deleteAlerts [delete]
export const deleteAlertsByIds = (params) => {
  return service({
    url: '/alerts/deleteAlertsByIds',
    method: 'delete',
    params
  })
}

// @Tags Alerts
// @Summary 更新alerts表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Alerts true "更新alerts表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /alerts/updateAlerts [put]
export const updateAlerts = (data) => {
  return service({
    url: '/alerts/updateAlerts',
    method: 'put',
    data
  })
}

// @Tags Alerts
// @Summary 用id查询alerts表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Alerts true "用id查询alerts表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /alerts/findAlerts [get]
export const findAlerts = (params) => {
  return service({
    url: '/alerts/findAlerts',
    method: 'get',
    params
  })
}

// @Tags Alerts
// @Summary 分页获取alerts表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取alerts表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /alerts/getAlertsList [get]
export const getAlertsList = (params) => {
  return service({
    url: '/alerts/getAlertsList',
    method: 'get',
    params
  })
}

// @Tags Alerts
// @Summary 不需要鉴权的alerts表接口
// @Accept application/json
// @Produce application/json
// @Param data query alertRecordPkgReq.AlertsSearch true "分页获取alerts表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /alerts/getAlertsPublic [get]
export const getAlertsPublic = () => {
  return service({
    url: '/alerts/getAlertsPublic',
    method: 'get',
  })
}
