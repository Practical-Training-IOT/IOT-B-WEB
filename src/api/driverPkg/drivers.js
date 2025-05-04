import service from '@/utils/request'
// @Tags Drivers
// @Summary 创建drivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Drivers true "创建drivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /drivers/createDrivers [post]
export const createDrivers = (data) => {
  return service({
    url: '/drivers/createDrivers',
    method: 'post',
    data
  })
}

// @Tags Drivers
// @Summary 删除drivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Drivers true "删除drivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /drivers/deleteDrivers [delete]
export const deleteDrivers = (params) => {
  return service({
    url: '/drivers/deleteDrivers',
    method: 'delete',
    params
  })
}

// @Tags Drivers
// @Summary 批量删除drivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除drivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /drivers/deleteDrivers [delete]
export const deleteDriversByIds = (params) => {
  return service({
    url: '/drivers/deleteDriversByIds',
    method: 'delete',
    params
  })
}

// @Tags Drivers
// @Summary 更新drivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Drivers true "更新drivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /drivers/updateDrivers [put]
export const updateDrivers = (data) => {
  return service({
    url: '/drivers/updateDrivers',
    method: 'put',
    data
  })
}

// @Tags Drivers
// @Summary 用id查询drivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Drivers true "用id查询drivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /drivers/findDrivers [get]
export const findDrivers = (params) => {
  return service({
    url: '/drivers/findDrivers',
    method: 'get',
    params
  })
}

// @Tags Drivers
// @Summary 分页获取drivers表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取drivers表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /drivers/getDriversList [get]
export const getDriversList = (params) => {
  return service({
    url: '/drivers/getDriversList',
    method: 'get',
    params
  })
}

// @Tags Drivers
// @Summary 不需要鉴权的drivers表接口
// @Accept application/json
// @Produce application/json
// @Param data query driverPkgReq.DriversSearch true "分页获取drivers表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /drivers/getDriversPublic [get]
export const getDriversPublic = () => {
  return service({
    url: '/drivers/getDriversPublic',
    method: 'get',
  })
}
