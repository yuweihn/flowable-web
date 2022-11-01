import request from '@/utils/request'

// 获取待办任务数量
export const getTodoListCount = () => {
  return request({
    url: '/flowable/task/todoCount',
    method: 'get'
  })
}