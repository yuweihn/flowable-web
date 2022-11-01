import request from '@/utils/request'

// 查询客户列表
export function listCustomer(query) {
  return request({
    url: '/system/customer/list',
    method: 'get',
    params: query
  })
}

// 查询销售客户列表
export function listSaleCustomer(query) {
  return request({
    url: '/system/sale/customer/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询客户详情
export function getCustomerById(query) {
  return request({
    url: '/system/customer/info',
    method: 'get',
    params: query
  })
}

// 新增客户
export function addCustomer(data) {
  return request({
    url: '/system/customer/create',
    method: 'post',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  return request({
    url: '/system/customer/update',
    method: 'put',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    data: data
  })
}

// 删除客户
export function delCustomer(params) {
  return request({
    url: '/system/customer/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: params
  })
}

// 获取当前登录销售的客户下拉列表
export function getSalesCustomerList(data) {
  return request({
    url: '/system/customer/sale-customers',
    method: 'get',
    params: data
  })
}
