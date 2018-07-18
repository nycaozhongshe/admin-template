import request from '@/utils/request';
import { baseUrl } from './config';

export function getCourseChapterList({}, params) {
  return request.post(baseUrl + '/courseChapter/list', params);
}

export function createOrUpdateCourseChapter({}, params) {
  return request.post(baseUrl + '/courseChapter/save', params);
}

export function delCourseChapter({}, params) {
  return request.post(baseUrl + '/courseChapter/delete', params);
}
