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
    <el-table class="table-page-content"
              border
              stripe
              size="small"
              :data="tableData"
              style="width: 100%"
              v-loading="loading"
              :height="tableHeight"
              @cell-click="cellClick"
              @select="handleSelectionChange"
              @select-all="handleSelectionChange"
              ref="table">

      <custom-table-colum :col="col"
                          :formatter="formatter"
                          @change-info="changeInfo"
                          :operation-list="operationList">
      </custom-table-colum>
    </el-table>

    <el-pagination
      class="table-page-footer"
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
import { formatDate } from '@/assets/methods';
import tableTemplate from '@/components/common/tableTemplate.js';
import { dateFtt } from '@/assets/methods';

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
      delMethods: 'delMIniTopic',
      getMethods: 'miniTopicList',
      editMethods: 'addMIniTopic',
      delInformationTest: '停用成功',
      delConfirmTest: '请确认是否停用此条信息',
      pageTotal:0,
      editorProcessParams: function(params) {
        delete params.code;
        delete params.msg;
        delete params.data;
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
      return { topicId:  row.id };
    },
    /*
      * 点击指定字段显示预览
     */
    cellClick(row, column, cell, event) {
      if (this.cellClickKey.indexOf(column.property) >= 0) {
        this.selection = row;
        this.$router.push({
          path: '/miniSpecialTopicManagementDetail',
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
          this.editMethods = 'updateMiniTopic';
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          break;
      }
    },
    addInfo() {
      this.editTitle = '新建信息';
      this.editMethods = 'addMIniTopic';
      this.selection = {};
      this.eiditDialogVisible = true;
    },
    getData() {
      this.loading = true;
      this.$store.dispatch(this.getMethods, this.parameterHandling()).then(res => {
        this.loading = false;
        if (res.data.code == '0') {
          if (this.$refs.table) this.$refs.table.bodyWrapper.scrollTop = 0;
          this.tableData = res.data.data.content;
          this.pageTotal = res.data.data.total;
        }
      });
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
