<!--  -->
<template>
  <div class="custom-search_wrapper">
    <div class="search__wraper">
      <el-dropdown trigger="click"
                   @command="clickFilterKey"
                   v-if="searchShow&&searchTypeList&&searchTypeList.length">
        <span class="el-dropdown-link">
          {{filterKey | capitalize}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>

        <el-dropdown-menu slot="dropdown"
                          class="dropdown-key">
          <el-dropdown-item divided
                            v-for="(item,index) in searchTypeList"
                            :key="index"
                            :command='{item,index}'>
            {{item.label}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-input placeholder="请输入查询内容"
                v-model="searchKey"
                suffix-icon="el-icon-search"
                class="search"
                @keyup.enter.native="postData"
                v-if="searchShow"
                size="small">
      </el-input>
      <el-button size="small"
                 @click="clearFilterKey"
                 v-if="searchShow"
                 class="clear">
        清空
      </el-button>
      <el-button type="success"
                 size="small"
                 @click="postData"
                 v-if="searchShow"
                 class="clear">
        查询
      </el-button>
      <el-button type="success"
                 size="small"
                 @click="addInfo"
                 v-if="bottonShow('add')"
                 class="clear">
        新增
      </el-button>

      <el-button type="success"
                 size="small"
                 @click="exportExcel"
                 v-if="bottonShow('export')"
                 class="clear">
        导出
      </el-button>
      <el-button type="success"
                 size="small"
                 @click="del"
                 v-if="bottonShow('del')"
                 class="clear">
        删除
      </el-button>
      <el-button type="success"
                 size="small"
                 @click="choosingCourse"
                 v-if="bottonShow('choosingCourse')"
                 class="clear">
        选择课程
      </el-button>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    'search-type-list': {
      default: [],
      type: Array,
    },
    /**  type  新增add  导出exprot  删除del */
    buttonType: {
      default: [],
      type: Array,
    },
    searchShow: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      filterKey: '',
      searchType: '',
      searchKey: '',
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    bottonShow(type) {
      return this.buttonType.indexOf(type) >= 0;
    },
    clickFilterKey(row) {
      this.filterKey = row.item.label;
      this.searchType = row.item.prop;
    },
    clearFilterKey() {
      this.filterKey = '';
      this.searchType = '';
      this.searchKey = '';
    },
    //发送内容
    postData() {
      this.$emit('search', this.postDataHanding());
    },
    //有内容返回对象
    postDataHanding() {
      return {
        searchType: this.searchType,
        searchKey: this.searchKey,
      };
    },
    addInfo() {
      this.$emit('add');
    },
    exportExcel() {
      this.$emit('export');
    },
    del() {
      this.$emit('del');
    },
    choosingCourse() {
      this.$emit('choosing-course');
    },
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '请选择筛选字段';
      return value;
    },
  },
};
</script>
<style lang='scss' scoped>
.custom-search_wrapper {
  height: 100%;
}
.search__wraper {
  .search {
    width: auto;
    margin-right: 12px;
    vertical-align: middle;
  }
  .clear {
    vertical-align: middle;
  }
}
</style>
