import request from '@/utils/request';
import { baseUrl } from './config';

export function selectCourseByName({}, params) {
  return request.post(baseUrl + '/course/findIdAndName', params);
}

export function getCourseList({}, params) {
  return request.post(baseUrl + '/course/list', params);
}

export function createOrUpdateCourse({}, params) {
  return request.post(baseUrl + '/course/save', params);
}

export function delCourse({}, params) {
  return request.post(baseUrl + '/course/delete', params);
}

