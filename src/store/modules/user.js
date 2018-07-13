import { login } from '@/api/login';

const user = {
  state: {
    // token: getToken(),
    name: '',
    avatar: '',
    roles: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.adminLogin_un, userInfo.adminLogin_pw)
          .then(res => {
            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('userId', res.id);
            sessionStorage.setItem('logged', 'true');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        resolve();
      });
    },
  },
};

export default user;
