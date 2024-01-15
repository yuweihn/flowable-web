import request from '@/utils/request'

// 标准产品端口列表
export function getProductPortOptions() {
  return request({
    url: '/system/product/port/options',
    method: 'get',
    params: {}
  })
}

// 标准产品设备列表
export function queryProductDeviceOptions() {
  return request({
    url: '/system/product/device/options',
    method: 'get',
    params: {}
  })
}
