import service from '@/utils/request'
// @Tags Resources
// @Summary 创建resources表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Resources true "创建resources表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /resources/createResources [post]
export const createResources = (data) => {
  return service({
    url: '/resources/createResources',
    method: 'post',
    data
  })
}

// @Tags Resources
// @Summary 删除resources表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Resources true "删除resources表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /resources/deleteResources [delete]
export const deleteResources = (params) => {
  return service({
    url: '/resources/deleteResources',
    method: 'delete',
    params
  })
}

// @Tags Resources
// @Summary 批量删除resources表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除resources表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /resources/deleteResources [delete]
export const deleteResourcesByIds = (params) => {
  return service({
    url: '/resources/deleteResourcesByIds',
    method: 'delete',
    params
  })
}

// @Tags Resources
// @Summary 更新resources表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Resources true "更新resources表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /resources/updateResources [put]
export const updateResources = (data) => {
  return service({
    url: '/resources/updateResources',
    method: 'put',
    data
  })
}

// @Tags Resources
// @Summary 用id查询resources表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Resources true "用id查询resources表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /resources/findResources [get]
export const findResources = (params) => {
  return service({
    url: '/resources/findResources',
    method: 'get',
    params
  })
}

// @Tags Resources
// @Summary 分页获取resources表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取resources表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /resources/getResourcesList [get]
export const getResourcesList = (params) => {
  return service({
    url: '/resources/getResourcesList',
    method: 'get',
    params
  })
}

export const getResourcesCheck = (data) => {
  return service({
    url: '/resources/getResourcesCheck',
    method: 'post',
    data
  })
}

export const getResources = (params) => {
  return service({
    url: '/resources/getResources',
    method: 'get',
    params
  })
}

// @Tags Resources
// @Summary 不需要鉴权的resources表接口
// @Accept application/json
// @Produce application/json
// @Param data query resources_iotReq.ResourcesSearch true "分页获取resources表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /resources/getResourcesPublic [get]
export const getResourcesPublic = () => {
  return service({
    url: '/resources/getResourcesPublic',
    method: 'get',
  })
}
