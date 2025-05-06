import service from '@/utils/request'
// @Tags Scenes
// @Summary 创建scenes表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Scenes true "创建scenes表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /scenes/createScenes [post]
export const createScenes = (data) => {
  return service({
    url: '/scenes/createScenes',
    method: 'post',
    data
  })
}

// @Tags Scenes
// @Summary 删除scenes表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Scenes true "删除scenes表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /scenes/deleteScenes [delete]
export const deleteScenes = (params) => {
  return service({
    url: '/scenes/deleteScenes',
    method: 'delete',
    params
  })
}

// @Tags Scenes
// @Summary 批量删除scenes表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除scenes表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /scenes/deleteScenes [delete]
export const deleteScenesByIds = (params) => {
  return service({
    url: '/scenes/deleteScenesByIds',
    method: 'delete',
    params
  })
}

// @Tags Scenes
// @Summary 更新scenes表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Scenes true "更新scenes表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /scenes/updateScenes [put]
export const updateScenes = (data) => {
  return service({
    url: '/scenes/updateScenes',
    method: 'put',
    data
  })
}

// @Tags Scenes
// @Summary 用id查询scenes表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Scenes true "用id查询scenes表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /scenes/findScenes [get]
export const findScenes = (params) => {
  return service({
    url: '/scenes/findScenes',
    method: 'get',
    params
  })
}

// @Tags Scenes
// @Summary 分页获取scenes表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取scenes表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /scenes/getScenesList [get]
export const getScenesList = (params) => {
  return service({
    url: '/scenes/getScenesList',
    method: 'get',
    params
  })
}

export const scenesSwitchChange = (data) => {
  return service({
    url: '/scenes/scenesSwitchChange',
    method: 'post',
    data
  })
}

export const getScenDevicesList = (params) => {
  return service({
    url: '/scenes/getScenDevicesList',
    method: 'get',
    params
  })
}


export const getScenFuncList = (params) => {
  return service({
    url: '/scenes/getScenFuncList',
    method: 'get',
    params
  })
}
// @Tags Scenes
// @Summary 不需要鉴权的scenes表接口
// @Accept application/json
// @Produce application/json
// @Param data query sceneReq.ScenesSearch true "分页获取scenes表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /scenes/getScenesPublic [get]
export const getScenesPublic = () => {
  return service({
    url: '/scenes/getScenesPublic',
    method: 'get',
  })
}
