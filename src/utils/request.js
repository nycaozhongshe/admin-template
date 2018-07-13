import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios实例
const service = axios.create({
  timeout: 5000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data);
    config.headers = { 'Content-Type': 'application/json' };
    Object.assign(config.headers, {
      token: sessionStorage.getItem('token') || null,
    });
    Object.assign(config.headers, {
      userId: sessionStorage.getItem('userId') || null,
    });
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  },
);

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data === 'INTERCEPT') {
      Message.error('登陆超时');
      router.replace({ path: 'login' });
    }

    if (response.data.code == 1006) {
      Message.error('密码错误');
    } else if (response.data.code != 0) {
      Message.error('服务繁忙');
    } else {
      return response.data.data;
    }
    Promise.reject(response.data);
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
