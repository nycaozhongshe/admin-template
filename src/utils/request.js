import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios实例
const service = axios.create({
  timeout: 4000, // 请求超时时间
});

let interceptor = response => {
  if (response.data === 'INTERCEPT') {
    Message.error('登陆超时');
    router.replace({ path: 'login' });
    return false;
  }
  if (response.data.code == 1006) {
    Message.error('密码错误');
    return false;
  } else if (response.data.code != 0) {
    Message.error('服务繁忙');
    return false;
  } else {
    return true;
  }
};
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = config => {
  for (let p in pending) {
    if (pending[p].u === config.url + '&' + config.method) {
      //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
};

// request拦截器
service.interceptors.request.use(
  config => {
    // removePending(config);
    // config.cancelToken = new cancelToken(c => {
    //   // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    //   pending.push({ u: config.url + '&' + config.method, f: c });
    // });

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
    return Promise.reject(error);
  },
);

// respone拦截器
service.interceptors.response.use(
  response => {
    if (interceptor(response)) {
      return response.data.data;
    } else {
      return Promise.reject(response.data);
    }
  },
  error => {
    console.log('err' + error); // for debug
    if (error == 'Cancel') {
      error = {
        message: '重复提交',
      };
    }
    Message({
      message: error.message || error,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
