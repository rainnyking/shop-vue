import request from './request'

export function getDataGoodsApi () {
  return request({
    url: 'shopData.php',
    method: 'get'
  })
}
