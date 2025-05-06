import service from '@/utils/request'
// @Tags Alarms
// @Summary 创建告警规则
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Alarms true "创建告警规则"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /alarms/createAlarms [post]
export const createAlarms = (data) => {
  return service({
    url: '/alarms/createAlarms',
    method: 'post',
    data
  })
}

// @Tags Alarms
// @Summary 删除告警规则
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Alarms true "删除告警规则"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /alarms/deleteAlarms [delete]
export const deleteAlarms = (params) => {
  return service({
    url: '/alarms/deleteAlarms',
    method: 'delete',
    params
  })
}

// @Tags Alarms
// @Summary 批量删除告警规则
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除告警规则"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /alarms/deleteAlarms [delete]
export const deleteAlarmsByIds = (params) => {
  return service({
    url: '/alarms/deleteAlarmsByIds',
    method: 'delete',
    params
  })
}

// @Tags Alarms
// @Summary 更新告警规则
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Alarms true "更新告警规则"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /alarms/updateAlarms [put]
export const updateAlarms = (data) => {
  return service({
    url: '/alarms/updateAlarms',
    method: 'put',
    data
  })
}

// @Tags Alarms
// @Summary 用id查询告警规则
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Alarms true "用id查询告警规则"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /alarms/findAlarms [get]
export const findAlarms = (params) => {
  return service({
    url: '/alarms/findAlarms',
    method: 'get',
    params
  })
}

// @Tags Alarms
// @Summary 分页获取告警规则列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取告警规则列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /alarms/getAlarmsList [get]
export const getAlarmsList = (params) => {
  return service({
    url: '/alarms/getAlarmsList',
    method: 'get',
    params
  })
}

export const getAllProductList = (params) => {
  return service({
    url: '/alarms/getAllProductList',
    method: 'get',
    params
  })
}

export const getEquipmentList = (params) => {
  return service({
    url: '/alarms/getEquipmentList',
    method: 'get',
    params
  })
}


// @Tags Alarms
// @Summary 不需要鉴权的告警规则接口
// @Accept application/json
// @Produce application/json
// @Param data query alertRulePkgReq.AlarmsSearch true "分页获取告警规则列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /alarms/getAlarmsPublic [get]
export const getAlarmsPublic = () => {
  return service({
    url: '/alarms/getAlarmsPublic',
    method: 'get',
  })
}
