import service from '@/utils/request'
// @Tags Products
// @Summary 创建products表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Products true "创建products表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /products/createProducts [post]
export const createProducts = (data) => {
  return service({
    url: '/products/createProducts',
    method: 'post',
    data
  })
}

// @Tags Products
// @Summary 删除products表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Products true "删除products表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /products/deleteProducts [delete]
export const deleteProducts = (params) => {
  return service({
    url: '/products/deleteProducts',
    method: 'delete',
    params
  })
}

// @Tags Products
// @Summary 批量删除products表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除products表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /products/deleteProducts [delete]
export const deleteProductsByIds = (params) => {
  return service({
    url: '/products/deleteProductsByIds',
    method: 'delete',
    params
  })
}

// @Tags Products
// @Summary 更新products表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data body model.Products true "更新products表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /products/updateProducts [put]
export const updateProducts = (data) => {
  return service({
    url: '/products/updateProducts',
    method: 'put',
    data
  })
}

// @Tags Products
// @Summary 用id查询products表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query model.Products true "用id查询products表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /products/findProducts [get]
export const findProducts = (params) => {
  return service({
    url: '/products/findProducts',
    method: 'get',
    params
  })
}

// @Tags Products
// @Summary 分页获取products表列表
// @Security ApiKeyAuth
// @Accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取products表列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /products/getProductsList [get]
export const getProductsList = (params) => {
  return service({
    url: '/products/getProductsList',
    method: 'get',
    params
  })
}

// @Tags Products
// @Summary 不需要鉴权的products表接口
// @Accept application/json
// @Produce application/json
// @Param data query productPkgReq.ProductsSearch true "分页获取products表列表"
// @Success 200 {object} response.Response{data=object,msg=string} "获取成功"
// @Router /products/getProductsPublic [get]
export const getProductsPublic = () => {
  return service({
    url: '/products/getProductsPublic',
    method: 'get',
  })
}

// 新增標準品類列表API
export const getStandardCategoryList = (params) => {
  return service({
    url: '/products/getStandardCategoryList',
    method: 'get',
    params
  })
}

// 獲取屬性列表
export const getPropertyList = (data) => {
  return service({
    url: '/products/getPropertyList',
    method: 'get',
    params: data
  })
}
