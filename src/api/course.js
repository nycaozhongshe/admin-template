import request from '@/utils/request';
import { baseUrl } from './config';

export function selectCourseByName({}, params) {
  return request.post(baseUrl + '/course/findIdAndName', params);
}
