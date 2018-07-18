<template>
  <div class="father user-list table-page__wrapper special-topic-management__wrapper"
       style="overflow: hidden;"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">
        专题列表
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
                  @current-change="currentChange"
                  :expandOperationList="[]"
                  :v-loading="loading"
                  :expandShow="false"
                  ref="childTable"
                  :col="col"
                  :operation-list="operationList"
                  :formatter="formatter"
                  @change-info="changeInfo">
    </custom-table>
    <el-pagination class="table-page-footer"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-size="pageConfig.page_size"
                   layout="total, prev, pager, next"
                   :total="pageTotal">
    </el-pagination>

    <el-dialog class="eiditor__wrapper"
               :title="editTitle"
               :visible.sync="eiditDialogVisible"
               width="50%"
               @close="closeEditor"
               center>
      <custom-editor-box :col="col"
                         ref="editorRef"
                         :data="selection"
                         :submitMethods="editMethods"
                         @close-edit="eiditDialogVisible=false"
                         :editorProcessParams="editorProcessParams"
                         @refresh-edit="getData">
      </custom-editor-box>
    </el-dialog>

    <el-dialog class="eiditor__wrapper"
               title="查看信息"
               :visible.sync="viewtDialogVisible"
               width="50%">

      <custom-check-box :col="col"
                        :data="selection">
      </custom-check-box>

    </el-dialog>
  </div>
</template>

<script>
import tableTemplate from '@/components/table/tableTemplate.js';

let col = [
  {
    prop: 'topicName',
    label: '名称',
    width: 150,
    required: true,
    fixed: true,
  },
  {
    prop: 'topicOutlineUrl',
    label: '大纲图片',
    width: 150,
    required: true,
    type: 'uploadImg',
  },
  {
    prop: 'topicCoverUrl',
    label: '封面图片',
    width: 150,
    required: true,
    type: 'uploadImg',
    // type:"img"
  },
];

let searchTypeList = [
  // {
  //   label: "姓名",
  //   prop: "name"
  // }
];

let formatter = (row, column, cellValue, index) => {
  if (cellValue === 0 || cellValue) {
    switch (column.property) {
      default:
        return cellValue;
    }
  } else {
    return '';
  }
};
let operationList = [
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
export default {
  name: 'courseTopicList',
  extends: tableTemplate,
  data() {
    return {
      col,
      searchTypeList,
      operationList,
      editTitle: '',
      cellClickKey: ['topicName'],
      delMethods: 'delTopic',
      getMethods: 'getTopicList',
      editMethods: 'updateTopic',
      delInformationTest: '停用成功',
      delConfirmTest: '请确认是否停用此条信息',
      pageTotal: 0,
      editorProcessParams: function(params) {
        delete params.createTime;
        return params;
      },
      //
      userList: {},
    };
  },
  computed: {
    formatter() {
      return formatter;
    },
  },
  methods: {
    /**
     * 删除参数处理
     */
    delProcessParams(row) {
      return { topicId: row.id };
    },
    /*
      * 点击指定字段显示预览
     */
    cellClick(params) {
      let { row, column, cell, event } = params;
      if (this.cellClickKey.indexOf(column.property) >= 0) {
        this.selection = row;
        this.$router.push({
          path: '/topicDetail',
          query: {
            id: this.selection.id,
            name: this.selection.topicName,
          },
        });
      }
    },
    /*
     * 多选时触发事件
     */
    handleSelectionChange(selection) {
      this.checkboxData = selection;
    },
    changeInfo(command) {
      switch (command.command) {
        case 'view':
          this.selection = command.scope.row;
          this.viewtDialogVisible = true;
          break;
        case 'del':
          this.delConfirm(command.scope.row);
          break;
        case 'edit':
          this.editTitle = '编辑信息';
          this.editMethods = 'updateTopic';
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          break;
      }
    },
    addInfo() {
      this.editTitle = '新建信息';
      this.editMethods = 'createTopic';
      this.selection = {};
      this.eiditDialogVisible = true;
    },
    /**
     * 获取列表参数操作
     */
    afterGetData(res) {
      this.pageTotal = res.total || 0;
      this.tableData = res.content || [];
    },
  },
};
</script>

<style lang="scss" >
.dialog-footer {
  text-align: center;
}
.special-topic-management__wrapper {
  .el-table td:nth-child(2) {
    color: #66b1ff;
    cursor: pointer;
  }
}
</style>
