import request from '@/utils/request'

// 查询流程表单列表
export function findFormList(query) {
  return request({
    url: '/flowable/form/list',
    method: 'get',
    params: query
  })
}

// 查询流程表单详细
export function getForm(formId) {
  return request({
    url: '/flowable/form/' + formId,
    method: 'get'
  })
}

// 新增流程表单
export function createForm(data) {
  return request({
    url: '/flowable/form',
    method: 'post',
    data: data
  })
}

// 修改流程表单
export function updateForm(data) {
  return request({
    url: '/flowable/form',
    method: 'put',
    data: data
  })
}
// 挂载表单
export function addDeployForm(data) {
  return request({
    url: '/flowable/form/addDeployForm',
    method: 'post',
    data: data
  })
}

// 删除流程表单
export function delForm(formId) {
  return request({
    url: '/flowable/form/' + formId,
    method: 'delete'
  })
}

// 导出流程表单
export function exportForm(query) {
  return request({
    url: '/flowable/form/export',
    method: 'get',
    params: query
  })
}

// 获取客户信息数据
export function getCustomerList(data) {
  return request({
    url: '/system/customer/option-list',
    method: 'get',
    params: data
  })
}

// 获取关联订单数据
export function getAssociatedOrderList(data) {
  return request({
    url: '/system/order/drop-down-list',
    method: 'get',
    params: data
  })
}

// 实施启动单内根据订单Id获取对应客户/合同/售前信息
export function findRelatedInfoByOrderId(data) {
  return request({
    url: '/system/impl/order/related/info',
    method: 'get',
    params: data
  })
}

// 根据订单ID查询订单详情
export function getOrderDetail(data) {
  return request({
    url: '/system/order/info',
    method: 'get',
    params: data
  })
}

// 指定客户未绑定合同的订单下拉列表
export function getUnboundContractOrderDropDownList(data) {
  return request({
    url: '/system/order/customer/unbound-contract/order/drop-down-list',
    method: 'get',
    params: data
  })
}

// 获取乙方企业下拉列表
export function getAgsCompanyDropDownList(data) {
  return request({
    url:'/system/config/ags-company/drop-down-list',
    method:'get',
    params: data
  })
}

// 获取合同信息下拉列表
export function getContractDropDownList(data) {
  return request({
    url:'/system/contract/drop-down-list',
    method:'get',
    params: data
  })
}
