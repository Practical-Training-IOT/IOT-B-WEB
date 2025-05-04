import service from '@/utils/request'
// @Tags RuleInfo
// @Summary 创建ruleInfo表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.RuleInfo true "创建ruleInfo表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /ruleInfo/createRuleInfo [post]
export const createRuleInfo = (data) => {
  return service({
    url: '/ruleInfo/createRuleInfo',
    method: 'post',
    data
  })
}

// @Tags RuleInfo
// @Summary 删除ruleInfo表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.RuleInfo true "删除ruleInfo表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /ruleInfo/deleteRuleInfo [delete]
export const deleteRuleInfo = (params) => {
  return service({
    url: '/ruleInfo/deleteRuleInfo',
    method: 'delete',
    params
  })
}

// @Tags RuleInfo
// @Summary 批量删除ruleInfo表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除ruleInfo表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /ruleInfo/deleteRuleInfo [delete]
export const deleteRuleInfoByIds = (params) => {
  return service({
    url: '/ruleInfo/deleteRuleInfoByIds',
    method: 'delete',
    params
  })
}

// @Tags RuleInfo
// @Summary 更新ruleInfo表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.RuleInfo true "更新ruleInfo表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /ruleInfo/updateRuleInfo [put]
export const updateRuleInfo = (data) => {
  return service({
    url: '/ruleInfo/updateRuleInfo',
    method: 'put',
    data
  })
}

// @Tags RuleInfo
// @Summary 用id查询ruleInfo表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.RuleInfo true "用id查询ruleInfo表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /ruleInfo/findRuleInfo [get]
export const findRuleInfo = (params) => {
  return service({
    url: '/ruleInfo/findRuleInfo',
    method: 'get',
    params
  })
}

// @Tags RuleInfo
// @Summary 分页获取ruleInfo表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取ruleInfo表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /ruleInfo/getRuleInfoList [get]
export const getRuleInfoList = (params) => {
  return service({
    url: '/ruleInfo/getRuleInfoList',
    method: 'get',
    params
  })
}

// @Tags RuleInfo
// @Summary 不需要鉴权的ruleInfo表接口
// @Accept application/json
// @Produce application/json
// @Param data query ruleReq.RuleInfoSearch true "分页获取ruleInfo表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /ruleInfo/getRuleInfoPublic [get]
export const getRuleInfoPublic = () => {
  return service({
    url: '/ruleInfo/getRuleInfoPublic',
    method: 'get',
  })
}
