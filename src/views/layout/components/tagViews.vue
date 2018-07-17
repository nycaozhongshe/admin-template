<!--  -->
<template>
  <div class="tagViews">
    <el-tabs v-model="activeName"
             type="card"
             closable
             @tab-remove="removeTab"
             @tab-click="clickTab">
      <el-tab-pane v-for="(item, index) in visitedViews"
                   :key="index"
                   :label="item.title"
                   :name="item.path">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '',
      visitedViews: [],
      ignoreRoute: ['课程详情'],
    };
  },
  methods: {
    addTab(params) {
      if (this.isExistRoute(params.title, this.ignoreRoute)) return;
      this.activeName = params.path;
      !this.isExist(params, this.visitedViews) &&
        this.visitedViews.push(params);
    },
    /**
     * 查重
     * @param params 子
     * @param array 父
     */
    isExist(params, array) {
      let is_exist = false;
      array.forEach(tab => {
        if (tab.title == params.title) {
          is_exist = true;
        }
      });
      return is_exist;
    },
    /**
     * 忽略指定tab
     * @param params 子
     * @param array 父
     */
    isExistRoute(params, array) {
      let is_exist = false;
      array.forEach(tab => {
        if (tab == params) {
          is_exist = true;
        }
      });
      return is_exist;
    },
    /**
     * 点击tab
     * @param targetName tabpan实例
     */
    clickTab(targetName) {
      this.$router.push(targetName.paneName);
    },
    /**
     * 删除tab
     * @param targetName ptah
     */
    removeTab(targetName) {
      let tabs = this.visitedViews;
      let activeName = this.activeName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.path;
            }
          }
        });
      }
      this.activeName = activeName;
      this.visitedViews = tabs.filter(tab => tab.path !== targetName);
    },
    /**
     * 判断route有没有定义
     * @return Boolean
     */
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    addViewTags() {
      const route = this.generateRoute();
      if (!route && route.meta.nocache) {
        return false;
      }
      const params = { title: route.meta.title, path: route.path };
      this.addTab(params);
    },
  },
  watch: {
    $route: {
      handler() {
        this.addViewTags();
      },
      immediate: true,
    },
  },
  mounted() {},
};
</script>
<style lang='scss'>
.tagViews {
  height: 35px;
  // padding-top: 3px;
  // padding-left: 20px;
  padding: 3px 10px 0;
  overflow: hidden;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .el-tabs__header {
    margin: 0;
  }
  .el-tab-pane {
    display: none;
  }
  .el-tabs__content {
    display: none;
  }
  .el-tabs__item {
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    border: 1px solid #e4e7ed;
    margin-left: 4px;
    // padding:0 8px;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card > .el-tabs__header {
    border: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid #e4e7ed;
  }
  .el-tabs__item.is-active {
    background-color: #42b983;
    color: #fff;
    border-color: #42b983;
  }
  .el-tabs__item:hover {
    color: #42b983;
  }
  .el-tabs__item.is-active:hover {
    color: #fff;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 26px;
  }
}
</style>
