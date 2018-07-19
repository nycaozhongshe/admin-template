import request from '@/utils/request';
import { baseUrl } from './config';

export function getCourseDetailList({}, params) {
  return request.post(baseUrl + '/course/list', params);
}

export function createOrUpdateCourseDetail({}, params) {
  return request.post(baseUrl + '/course/save', params);
}

export function delCourseDetail({}, params) {
  return request.post(baseUrl + '/course/delete', params);
}
