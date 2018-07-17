<template>
  <div class="father user-list table-page__wrapper"
       style="overflow: hidden;"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">
        <!-- 视频列表 -->
      </span>
      <div class="search__wraper">
        <el-input placeholder="请输入课程名称"
                  v-model="searchKey"
                  class="search"
                  :type="searchInputType"
                  @keyup.enter.native="getData"
                  size="small">
          <i class="el-input__icon el-icon-search"
             @click="getData"
             slot="suffix">
          </i>
        </el-input>
      </div>
    </div>
    <el-table class="table-page-content"
              :data="tableData"
              border
              stripe
              :height="tableHeight"
              style="width: 100%"
              v-loading="loading"
              @cell-click="cellClick"
              size="small"
              @select-all="handleSelectionChange"
              @select="handleSelectionChange"
              ref="table">

      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <!-- <el-table-column type="index" fixed width="50">
      </el-table-column> -->
      <el-table-column v-for="(item,index) in col"
                       :key="index"
                       :fixed="item.fixed"
                       :prop="item.prop"
                       :label="item.label"
                       :formatter="formatter"
                       :width="item.width">
      </el-table-column>
    </el-table>
    <el-pagination class="table-page-footer"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-size="pageConfig.page_size"
                   layout="total, prev, pager, next"
                   :total="pageTotal">
    </el-pagination>
  </div>
</template>

<script>
import { formatDate } from '@/assets/methods';
import tableTemplate from '@/components/common/tableTemplate.js';
import { dateFtt } from '@/assets/methods';
import courseManagement from '@/components/courseAddVideo.vue';

let col = [
  {
    prop: 'name',
    label: '课程名称',
    fixed: 'left',
  },
  {
    prop: 'currentPrice',
    label: '实际价格',
  },
];
let formatter = function(row, column, cellValue, index) {
  if (cellValue === 0 || cellValue) {
    switch (column.property) {
      case 'deleted':
        return '删除';
        break;
      default:
        return cellValue;
    }
    //删除状态
  } else {
    return '';
  }
};
let operationList = [
  {
    command: 'view',
    content: '内容',
  },
  {
    command: 'edit',
    content: '编辑',
  },
  {
    command: 'del',
    content: '删除',
  },
  {
    command: 'add',
    content: '添加到课程',
  },
];
export default {
  props: ['topic-id','select-course-show'],
  name: 'user-list',
  extends: tableTemplate,
  data() {
    return {
      formatter,
      col,
      operationList,
      searchType: 'name',
      editorProcessParams: function(params) {
        delete params.code;
        delete params.msg;
        delete params.data;
        return params;
      },
      //自定义
      courseVisible: false,
      selectedContent: [],
      formLabelAlign: {
        courseId: '',
        orderName: '',
        orderNum: '',
      },
      toCourseVisible: false,
    };
  },
  components: {
    courseManagement,
  },
  methods: {
    clearSelection() {
      this.$refs.table.clearSelection();
      this.searchKey = '';
    },
    /*
     *@description 多选时触发事件
     */
    handleSelectionChange(selection) {
      this.$emit('post-to-course', selection);
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch(
          'miniCourseNotinTopic',
          Object.assign({ topicId: this.topicId }, this.parameterHandling()),
        )
        .then(res => {
          this.loading = false;
          if (res.data.code == '0') {
            if (this.$refs.table) this.$refs.table.bodyWrapper.scrollTop = 0;
            this.loading = false;
            this.tableData = res.data.data.content;
            this.pageTotal = res.data.data.total;
          }
        });
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
