// 频道请求模块
import request from '@/utils/request'

// 获取用户的频道信息
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
// 添加用户频道
export const addUserChannel = channel => {
  return request({
    // GET获取 POST提交数据 PUT修改数据 DELETE删除数据  PATCH(部分更新)
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}
// 删除用户频道
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELERE',
    url: `/v1_0/user/channels/${channelId}`
  })
}

// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
  })
}
