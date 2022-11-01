import request from '@/utils/request'

// 权限组件列表
export function getFlowAuthWidgetList(query) {
  return request({
    url: '/flowauth/widget/list',
    method: 'get',
    params: query
  })
}

// 新增权限组件
export function addFlowAuthWidget(data) {
  return request({
    url: '/flowauth/widget/create',
    method: 'post',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    data: data
  })
}

// 修改权限组件
export function updateFlowAuthWidget(data) {
  return request({
    url: '/flowauth/widget/update',
    method: 'put',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    data: data
  })
}

// 删除权限组件
export function deleteFlowAuthWidget(params) {
  return request({
    url: '/flowauth/widget/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: params
  })
}

// 权限节点列表
export function queryFlowAuthNodeList(query) {
  return request({
    url: '/flowauth/node/list',
    method: 'get',
    params: query
  })
}

// 删除权限节点
export function deleteFlowAuthNode(params) {
  return request({
    url: '/flowauth/node/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: params
  })
}

// 节点权限配置列表
export function queryFlowAuthNodeSettingList(query) {
  return request({
    url: '/flowauth/node/setting/list',
    method: 'get',
    params: query
  })
}

// 保存节点权限配置
export function saveFlowAuthNodeSetting(procDefId, nodeKey, data) {
  return request({
    url: '/flowauth/node/setting/' + procDefId + '/' + nodeKey,
    method: 'post',
    data: data
  })
}

// 删除节点权限配置
export function deleteFlowAuthNodeSetting(params) {
  return request({
    url: '/flowauth/node/setting/delete',
    method: 'delete',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: params
  })
}

// 根据taskId查询权限配置列表
export function queryFlowAuthSettingListByTaskId(taskId) {
  return request({
    url: '/flowauth/node/task/setting/list',
    method: 'get',
    params: {
      "taskId": taskId
    }
  })
}

// 根据taskId查询起始节点权限列表
export function queryStartNodeFlowAuthSettingList(taskId) {
  return request({
    url: '/flowauth/node/start-task/setting/list',
    method: 'get',
    params: {
      "taskId": taskId
    }
  })
}

