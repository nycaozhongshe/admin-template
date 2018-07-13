import request from '@/utils/request';

export function login(adminLogin_un, adminLogin_pw) {
  return request({
    url: 'http://39.104.51.142:8086/wbedu_admin/wbedu/admin/adminLogin',
    method: 'post',
    data: {
      adminLogin_un: adminLogin_un,
      adminLogin_pw: adminLogin_pw,
    },
  });
}
