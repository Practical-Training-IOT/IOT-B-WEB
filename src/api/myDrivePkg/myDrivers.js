import service from '@/utils/request'
// @Tags MyDrivers
// @Summary 创建myDrivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.MyDrivers true "创建myDrivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /myDrivers/createMyDrivers [post]
export const createMyDrivers = (data) => {
  return service({
    url: '/myDrivers/createMyDrivers',
    method: 'post',
    data
  })
}

// @Tags MyDrivers
// @Summary 删除myDrivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.MyDrivers true "删除myDrivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /myDrivers/deleteMyDrivers [delete]
export const deleteMyDrivers = (params) => {
  return service({
    url: '/myDrivers/deleteMyDrivers',
    method: 'delete',
    params
  })
}

// @Tags MyDrivers
// @Summary 批量删除myDrivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除myDrivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /myDrivers/deleteMyDrivers [delete]
export const deleteMyDriversByIds = (params) => {
  return service({
    url: '/myDrivers/deleteMyDriversByIds',
    method: 'delete',
    params
  })
}

// @Tags MyDrivers
// @Summary 更新myDrivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.MyDrivers true "更新myDrivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /myDrivers/updateMyDrivers [put]
export const updateMyDrivers = (data) => {
  return service({
    url: '/myDrivers/updateMyDrivers',
    method: 'put',
    data
  })
}

// @Tags MyDrivers
// @Summary 用id查询myDrivers表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.MyDrivers true "用id查询myDrivers表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /myDrivers/findMyDrivers [get]
export const findMyDrivers = (params) => {
  return service({
    url: '/myDrivers/findMyDrivers',
    method: 'get',
    params
  })
}

// @Tags MyDrivers
// @Summary 分页获取myDrivers表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取myDrivers表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /myDrivers/getMyDriversList [get]
export const getMyDriversList = (params) => {
  return service({
    url: '/myDrivers/getMyDriversList',
    method: 'get',
    params
  })
}

// @Tags MyDrivers
// @Summary 不需要鉴权的myDrivers表接口
// @Accept application/json
// @Produce application/json
// @Param data query myDrivePkgReq.MyDriversSearch true "分页获取myDrivers表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /myDrivers/getMyDriversPublic [get]
export const getMyDriversPublic = () => {
  return service({
    url: '/myDrivers/getMyDriversPublic',
    method: 'get',
  })
}
