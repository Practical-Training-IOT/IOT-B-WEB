import service from '@/utils/request'
// @Tags Devices
// @Summary 创建devices表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Devices true "创建devices表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /devices/createDevices [post]
export const createDevices = (data) => {
  return service({
    url: '/devices/createDevices',
    method: 'post',
    data
  })
}

// @Tags Devices
// @Summary 删除devices表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Devices true "删除devices表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /devices/deleteDevices [delete]
export const deleteDevices = (params) => {
  return service({
    url: '/devices/deleteDevices',
    method: 'delete',
    params
  })
}

// @Tags Devices
// @Summary 批量删除devices表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除devices表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /devices/deleteDevices [delete]
export const deleteDevicesByIds = (params) => {
  return service({
    url: '/devices/deleteDevicesByIds',
    method: 'delete',
    params
  })
}

// @Tags Devices
// @Summary 更新devices表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Devices true "更新devices表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /devices/updateDevices [put]
export const updateDevices = (data) => {
  return service({
    url: '/devices/updateDevices',
    method: 'put',
    data
  })
}

// @Tags Devices
// @Summary 用id查询devices表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Devices true "用id查询devices表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /devices/findDevices [get]
export const findDevices = (params) => {
  return service({
    url: '/devices/findDevices',
    method: 'get',
    params
  })
}

// @Tags Devices
// @Summary 分页获取devices表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取devices表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /devices/getDevicesList [get]
export const getDevicesList = (params) => {
  return service({
    url: '/devices/getDevicesList',
    method: 'get',
    params
  })
}

// @Tags Devices
// @Summary 不需要鉴权的devices表接口
// @Accept application/json
// @Produce application/json
// @Param data query devicePkgReq.DevicesSearch true "分页获取devices表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /devices/getDevicesPublic [get]
export const getDevicesPublic = () => {
  return service({
    url: '/devices/getDevicesPublic',
    method: 'get',
  })
}

export const getProductGroups = () => {
  return service({
    url: '/devices/getProductGroups',
    method: 'get',
  })
}

export const getProductTwoGroups = () => {
  return service({
    url: '/devices/getProductTwoGroups',
    method: 'get',
  })
}

export const getDriverGroups = () => {
  return service({
    url: '/devices/getDriverGroups',
    method: 'get',
  })
}