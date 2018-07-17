import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';

Vue.use(Vuex);


const getChunks = modulesContext => {
  const chunks = modulesContext.keys().reduce((modules, key) => {
    modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default;
    return modules;
  }, {});
  return chunks;
};
const modules = require.context('./modules', false, /\.js$/);
const modulesChunks = { modules: getChunks(modules) };

const store = new Vuex.Store(
  Object.assign(
    {
      getters,
    },
    modulesChunks,
  ),
);

export default store;
