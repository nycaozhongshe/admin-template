<template>
  <div class="app-wrapper"
       :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened"
         class="drawer-bg"
         @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <el-scrollbar class="main-container-scrollbar-wrapper">
      <div class="main-container">
        <navbar></navbar>
        <tag-views></tag-views>
        <app-main></app-main>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, tagViews } from './components';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    tagViews,
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.main-container {
  height: 100%;
}
</style>

<style lang="scss">
.main-container-scrollbar-wrapper {
  height: 100%;
  .el-scrollbar__view {
    height: 100%;
  }
  .el-scrollbar__bar {
    z-index: 1000;
  }
}
</style>
