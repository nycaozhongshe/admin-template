import request from '@/utils/request';
import { baseUrl } from './config';

// export function getCourseSectionList({}, params) {
//   return request.post(baseUrl + '/courseSection/list', params);
// }

export function createOrUpdateCourseSection({}, params) {
  return request.post(baseUrl + '/courseSection/save', params);
}

export function delCourseSection({}, params) {
  return request.post(baseUrl + '/courseSection/delete', params);
}
