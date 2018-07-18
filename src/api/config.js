let url = 'https://api.jiazhilifang.com/vc_video';
// let url = 'http://192.168.1.28:8080/vc_video';

// let url = 'http://192.168.1.27:8080/vc_video';


if ('production' == process.env.NODE_ENV)
  url = 'https://api.jiazhilifang.com/vc_video';

module.exports = {
  baseUrl: url,
};
