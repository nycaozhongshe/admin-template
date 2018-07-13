import request from '@/utils/request';
import { baseUrl } from './config';

export function createdBanner({}, params) {
  return request.post(baseUrl + '/carouselFigure/addCarouselFigure', params);
}

export function delBanner({}, params) {
  return request.post(baseUrl + '/carouselFigure/deletePictureById', params);
}

export function updateBanner({}, params) {
  return request.post(baseUrl + '/carouselFigure/updatePictureById', params);
}

export function getBanner({}, params) {
  return request.post(baseUrl + '/carouselFigure/getCarouselFigure', params);
}
