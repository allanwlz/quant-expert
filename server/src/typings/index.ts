/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-09-02 00:29:20
 * @LastEditTime: 2023-09-02 01:06:02
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/typings/index.ts
 */
export interface IServiceRes<T> {
  errorMsg: string;
  data?: T;
}

export interface IResponse<T> {
  code: number;
  msg: string;
  data?: T;
}
