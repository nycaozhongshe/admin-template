import request from '@/utils/request';
import { baseUrl } from './config';

export function getCourseTypeList({}, params) {
  return request.post(baseUrl + '/coursePlate/list', params);
}

export function createOrUpdateCourseType({}, params) {
  return request.post(baseUrl + '/coursePlate/save', params);
}

export function delCourseType({}, params) {
  return request.post(baseUrl + '/coursePlate/delete', params);
}
