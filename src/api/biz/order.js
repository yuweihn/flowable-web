import request from '@/utils/request'

// 获取订单列表
export function getOrderList(query) {
  return request({
    url: '/system/order/list',
    method: 'get',
    params: query
  })
}

// 删除订单
export function deleteOrder(params) {
  return request({
    url: '/system/order/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: params
  })
}

// 订单标准产品(端口)
export function OSP_PortList(query) {
  return request({
    url: '/system/order/port/list',
    method: 'get',
    params: query
  })
}

// 订单标准产品(设备)
export function OSP_DevList(query) {
  return request({
    url: '/system/order/device/list',
    method: 'get',
    params: query
  })
}

// 订单非标准产品(MPLS/IPSec)
export function ONSP_MpLsList(query) {
  return request({
    url: '/system/order/mpls-ipsec/list',
    method: 'get',
    params: query
  })
}

// 订单非标准产品(专线)
export function ONSP_SpecialLineList(query) {
  return request({
    url: '/system/order/special-line/list',
    method: 'get',
    params: query
  })
}

// 订单非标准产品(Internet)
export function ONSP_InternetList(query) {
  return request({
    url: '/system/order/internet/list',
    method: 'get',
    params: query
  })
}

// 订单非标准产品(IDC)
export function ONSP_IDCList(query) {
  return request({
    url: '/system/order/idc/list',
    method: 'get',
    params: query
  })
}

// 订单非标准产品(服务)
export function ONSP_ServiceList(query) {
  return request({
    url: '/system/order/srv/list',
    method: 'get',
    params: query
  })
}

// 订单非标准产品(集成)
export function ONSP_IntegrationList(query) {
  return request({
    url: '/system/order/integration/list',
    method: 'get',
    params: query
  })
}