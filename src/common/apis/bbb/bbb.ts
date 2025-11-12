
import { request2 } from "@/http/axios"


// 查询表格列表
export function listBbb(query: any) {
    return request2({
      url: '/bbb/bbb/list',
      method: 'get',
      params: query
    })
  }
  
  // 查询表格详细
  export function getBbb(id: any) {
    return request2({
      url: '/bbb/bbb/' + id,
      method: 'get'
    })
  }
  
  // 新增表格
  export function addBbb(data: any) {
    return request2({
      url: '/bbb/bbb',
      method: 'post',
      data: data
    })
  }
  
  // 修改表格
  export function updateBbb(data: any) {
    return request2({
      url: '/bbb/bbb',
      method: 'put',
      data: data
    })
  }
  
  // 删除表格
  export function delBbb(id: any) {
    return request2({
      url: '/bbb/bbb/' + id,
      method: 'delete'
    })
  }
  