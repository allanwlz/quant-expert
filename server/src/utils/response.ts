/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-09-02 01:03:38
 * @LastEditTime: 2023-09-02 01:05:55
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/utils/response.ts
 */
import { IResponse } from 'src/typings';

function buildSuccessResponse<T>(data: T): IResponse<T> {
  return {
    code: 0,
    msg: 'success',
    data,
  };
}

function buildErrorResponse(errorMsg: string, errorCode = -1): IResponse<void> {
  return {
    code: errorCode,
    msg: errorMsg,
  };
}

export { buildSuccessResponse, buildErrorResponse };
