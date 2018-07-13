import request from '@/utils/request';
import { baseUrl } from './config';

export function changeVersion({}, params) {
  return request.post(baseUrl + '/audit/updateAudit', params);
}

export function getVersion({}, params) {
  return request.post(baseUrl + '/audit/selectAudit', params);
}
