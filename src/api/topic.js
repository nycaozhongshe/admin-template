import request from '@/utils/request';
import { baseUrl } from './config';

export function selectTopicByName({}, params) {
  return request.post(baseUrl + '/topic/selectTopicByName', params);
}
