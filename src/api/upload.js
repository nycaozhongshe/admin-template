import request from '@/utils/request';
import { baseUrl } from './config';

export function createImgUpToken({}, params) {
  return request.post(baseUrl + '/video/createUpToken', params);
}

export function createVideoUpToken({}, params) {
  return request.post(baseUrl + '/video/getUploadVideoUrl', params);
}
