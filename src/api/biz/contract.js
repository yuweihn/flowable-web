import request from '@/utils/request'

// 获取合同列表
export function getContractList(query) {
  return request({
    url: '/system/contract/list',
    method: 'get',
    params: query
  })
}
// 删除合同列表
export function deleteContract(query) {
  return request({
    url: '/system/contract/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: query
  })
}

// 获取合同附件
export function getContractAttachList(query) {
  return request({
    url: '/system/contract/attach/list',
    method: 'get',
    params: query
  })
}
// 获取合同订单
export function getContractOrderList(query) {
  return request({
    url: '/system/contract/order/list',
    method: 'get',
    params: query
  })
}

// 根据合同Id获取合同详情
export function getContracInfoById(query) {
  return request({
    url: '/system/contract/info',
    method: 'get',
    params: query
  })
}