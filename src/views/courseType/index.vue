<template>
  <div class="father career-list table-page__wrapper miniCourseType__wrapper"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">{{title}}
        <custom-sort :sort-list="sortList"
                     @post-sort-data="getSortData">
        </custom-sort>
      </span>
      <custom-search @search="getSearchKey"
                     :search-type-list="searchTypeList"
                     @add="addInfo"
                     :button-type="['add']">
      </custom-search>
    </div>
    <custom-table :data="tableData"
                  :height="tableHeight"
                  @cell-click="cellClick"
                  :col="coltable"
                  :operation-list="operationList"
                  :formatter="formatter"
                  :expandShow="true"
                  @expand-change="expandChange"
                  @current-change="currentChange"
                  @click-expand-content="clickExpandContent"
                  :operation-cover="true"
                  v-loading="loading"
                  ref="childTable"
                  :expand-operation-list="expandOperationList"
                  @change-info-type="changeInfoType"
                  @change-info="changeInfo">
    </custom-table>

    <!-- <el-pagination class="table-page-footer"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-size="pageConfig.page_size"
                   layout="total, prev, pager, next"
                   :total="pageTotal">
    </el-pagination> -->

    <el-dialog class="eiditor__wrapper"
               title="编辑信息"
               :visible.sync="eiditDialogVisible"
               width="50%"
               @close="closeEditor"
               center>

      <custom-editor-box :col="coltable"
                         ref="editorRef"
                         :data="selection"
                         :editorProcessParams="editorProcessParams"
                         :submitMethods="editMethods"
                         @close-edit="eiditDialogVisible=false"
                         @refresh-edit="getData">
      </custom-editor-box>

    </el-dialog>
    <el-dialog class="eiditor__wrapper"
               title="查看信息"
               :visible.sync="viewtDialogVisible"
               width="50%">

      <custom-check-box :col="coltable"
                        :data="selection">
      </custom-check-box>

    </el-dialog>

  </div>
</template>

<script>
import tableTemplate from '@/components/table/tableTemplate.js';

import { dateFtt } from '@/utils';
let col = [
  {
    prop: 'title',
    label: '板块名称',
    required: true,
    width: 150,
  },
  {
    prop: 'sort',
    label: '排序',
    width: 100,
    required: true,
    type: 'number',
  },
  {
    prop: 'coverImg',
    label: '封面图片',
    width: 150,
    type: 'uploadImg',
  },
];
let operationList = [
  // {
  //   command: 'view',
  //   content: '内容',
  // },
  {
    command: 'addType',
    content: '新增分类',
  },
  {
    command: 'edit',
    content: '编辑',
    type: 'primary',
  },
  {
    command: 'del',
    content: '删除',
    type: 'danger',
  },
];
let searchTypeList = [];
export default {
  name: 'course-list',
  extends: tableTemplate,
  data() {
    return {
      coltable: col,
      operationList,
      searchTypeList,
      filterKey: '',
      title: '课程分类列表',
      delMethods: 'delCourseType',
      editMethods: 'createOrUpdateCourseType',
      getMethods: 'getCourseTypeList',
      searchInputType: 'text',
      labelsSelect: [],
      /**
       * 点击单元格 显示查看窗口 可为多个
       */
      cellClickKey: ['name'],
      /**
       * 编辑参数处理
       * @param  Object
       *
       */
      editorProcessParams: function(params) {
        params.sort = Number(params.sort);
        return params;
      },
      //字典项显示处理
      gounpTableDataLabel: [],
      gounpTableDataType: [],
      gounpTableDataTopics: [],
      formatterLabels: {},
      formatterType: {},
      formatterTopics: {},
      neglectingHeight: ['pagination'],
    };
  },
  computed: {
    expandOperationList() {
      let arr = operationList.slice(1, 3);
      // arr[0].label = '类型名称';
      return arr;
    },
    /**  不能使用col  col已定义*/
    formatter() {
      return (row, column, cellValue, index) => {
        if (cellValue === 0 || cellValue) {
          switch (column.property) {
            case 'createTime':
              return dateFtt('yy-MM-dd', new Date(cellValue));
              break;
            default:
              return cellValue;
          }
        } else {
          return '暂无';
        }
      };
    },
  },
  methods: {
    //新增板块/类型
    addInfo() {
      this.coltable[2].disabled = true;
      this.selection = {};
      this.eiditDialogVisible = true;
    },
    cellClick(pamrams) {},
    /**
     * 分类操作
     */
    changeInfoType(command) {
      let operateMethods = {
        view: () => {
          this.selection = command.scope.row;
          this.viewtDialogVisible = true;
        },
        edit: () => {
          this.coltable[2].disabled = false;
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          this.editMethods = 'addMiniCourseType';
        },
        del: () => {
          this.delMethods = 'delMiniCourseType';
          this.delConfirm(command.scope.row);
        },
        addType: () => {},
      };
      operateMethods[command.command]();
    },
    /**
     * 板块操作
     */
    changeInfo(command) {
      let operateMethods = {
        view: () => {
          this.selection = command.scope.row;
          this.viewtDialogVisible = true;
        },
        edit: () => {
          this.coltable[2].disabled = true;
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          this.editMethods = 'addMiniCoursePlate';
        },
        del: () => {
          this.delMethods = 'delMiniCoursePlate';
          this.delConfirm(command.scope.row);
        },
        /** 新增课程类型 */
        addType: () => {
          this.coltable[2].disabled = false;
          this.selection = {
            plateId: command.scope.row.id,
          };
          this.eiditDialogVisible = true;
          this.editMethods = 'addMiniCourseType';
          // command.scope.row
        },
      };
      operateMethods[command.command]();
    },
    /**
     * 获取列表参数操作
     */
    afterGetData(res) {
      this.pageTotal = res.total || 0;
      this.tableData = res || [];
      this.toggleRowExpansion();
    },
    toggleRowExpansion() {
      if (!this.$refs.childTable) return;
      this.$refs.childTable.$refs.table.toggleRowExpansion(
        this.tableData[this.toggleRowExpansionIndex],
      );
    },
  },
  created() {},
};
</script>

<style lang="scss">
.miniCourseType__wrapper {
  .el-table td {
    // cursor: pointer;
    font-weight: 700;
    color: #333;
  }
  .el-dropdown-link {
    color: #333;
  }
}
</style>

<style scoped>
.dropdown-key {
  border-color: #ccc;
}
</style>
