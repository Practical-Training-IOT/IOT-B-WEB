import service from '@/utils/request'
// @Tags AlertRules
// @Summary 创建alertRules表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.AlertRules true "创建alertRules表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /alertRules/createAlertRules [post]
export const createAlertRules = (data) => {
  return service({
    url: '/alertRules/createAlertRules',
    method: 'post',
    data
  })
}

// @Tags AlertRules
// @Summary 删除alertRules表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.AlertRules true "删除alertRules表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /alertRules/deleteAlertRules [delete]
export const deleteAlertRules = (params) => {
  return service({
    url: '/alertRules/deleteAlertRules',
    method: 'delete',
    params
  })
}

// @Tags AlertRules
// @Summary 批量删除alertRules表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除alertRules表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /alertRules/deleteAlertRules [delete]
export const deleteAlertRulesByIds = (params) => {
  return service({
    url: '/alertRules/deleteAlertRulesByIds',
    method: 'delete',
    params
  })
}

// @Tags AlertRules
// @Summary 更新alertRules表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.AlertRules true "更新alertRules表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /alertRules/updateAlertRules [put]
export const updateAlertRules = (data) => {
  return service({
    url: '/alertRules/updateAlertRules',
    method: 'put',
    data
  })
}

// @Tags AlertRules
// @Summary 用id查询alertRules表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.AlertRules true "用id查询alertRules表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /alertRules/findAlertRules [get]
export const findAlertRules = (params) => {
  return service({
    url: '/alertRules/findAlertRules',
    method: 'get',
    params
  })
}

// @Tags AlertRules
// @Summary 分页获取alertRules表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取alertRules表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /alertRules/getAlertRulesList [get]
export const getAlertRulesList = (params) => {
  return service({
    url: '/alertRules/getAlertRulesList',
    method: 'get',
    params
  })
}

// @Tags AlertRules
// @Summary 不需要鉴权的alertRules表接口
// @Accept application/json
// @Produce application/json
// @Param data query alertRulePkgReq.AlertRulesSearch true "分页获取alertRules表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /alertRules/getAlertRulesPublic [get]
export const getAlertRulesPublic = () => {
  return service({
    url: '/alertRules/getAlertRulesPublic',
    method: 'get',
  })
}
