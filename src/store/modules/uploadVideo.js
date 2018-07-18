export default {
  state: {
    UP_LOAD_VIDEO_LIST: {},
  },
  mutations: {
    ADD_UPLAOD_VIDEO_ITEM(state, n) {
      state.UP_LOAD_VIDEO_LIST[n] = true;
    },
    DEL_UPLAOD_VIDEO_ITEM(state, n) {
      delete state.UP_LOAD_VIDEO_LIST[n];
    },
  },
  actions: {},
};
