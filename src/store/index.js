import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import banner from './modules/banner';

import upload from './modules/upload';
import topic from './modules/topic';

import course from './modules/course';

import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    banner,
    upload,
    course,
    topic,
  },
  getters,
});

export default store;
