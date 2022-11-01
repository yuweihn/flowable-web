import request from '@/utils/request'
// 获取实施启动列表
export function getImplList(query) {
  return request({
    url: '/system/impl/list',
    method: 'get',
    params: query
  })
}
// 删除合同列表
export function deleteImpl(params) {
  return request({
    url: '/system/impl/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: params
  })
}
// 获取实施启动订单
export function getImplOrderList(query) {
  return request({
    url: '/system/impl/order/list',
    method: 'get',
    params: query
  })
}

// 根据实施启动单Id获取启动单详情
export function getImplInfoById(query) {
  return request({
    url: '/system/impl/info',
    method: 'get',
    params: query
  })
}