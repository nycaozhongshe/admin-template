let url = 'https://api.jiazhilifang.com/vc_video';

if ('production' == process.env.NODE_ENV)
  url = 'https://api.jiazhilifang.com/vc_video';

module.exports = {
  baseUrl: url,
};
