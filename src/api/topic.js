import request from '@/utils/request';
import { baseUrl } from './config';

export function selectTopicByName({}, params) {
  return request.post(baseUrl + '/topic/selectTopicByName', params);
}

export function createTopic({}, params) {
  return request.post(baseUrl + '/topic/addTopic', params);
}

export function delTopic({}, params) {
  return request.post(baseUrl + '/topic/deleteTopic', params);
}

export function updateTopic({}, params) {
  return request.post(baseUrl + '/topic/updateTopic', params);
}

export function getTopicList({}, params) {
  return request.post(baseUrl + '/topic/selectTopic', params);
}
//查询专题下课程
export function selectTopicOrCourse({}, params) {
  return request.post(baseUrl + '/topic/selectTopicOrCourse', params);
}
//专题下添加课程
export function addCourseToTopic({}, params) {
  return request.post(baseUrl + '/topic/addCourseToTopic', params);
}
//删除专题下课程
export function deleteCourseInTopic({}, params) {
  return request.post(baseUrl + '/topic/deleteCourseInTopic', params);
}
