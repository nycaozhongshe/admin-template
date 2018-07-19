<template>
  <el-menu class="navbar"
           mode="horizontal">
    <hamburger class="hamburger-container"
               :toggleClick="toggleSideBar"
               :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="freshen-container"
         @click="freshen">

      <span class="svg-container">
        <svg-icon icon-class="freshen"
                  class-name="svg-icon-freshen"></svg-icon>
      </span>
    </div>
    <el-dropdown class="avatar-container"
                 trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar"
             :src="'http://wx1.sinaimg.cn/mw690/0060lm7Tly1ft6vexakejg3028028746.gif'">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown"
                        slot="dropdown">
        <router-link class="inlineBlock"
                     to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout"
                style="display:block;">退出登陆</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(['sidebar']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    logout() {
      this.$router.push('/login');
      location.reload();
    },
    freshen() {
      this.$router.replace('/freshen')
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .freshen-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 85px;
    cursor: pointer;
    .svg-icon-freshen {
      width: 1.5em;
      height: 1.5em;
      margin-top: 0.8em;
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

