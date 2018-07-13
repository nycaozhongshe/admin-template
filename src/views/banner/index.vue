<template>
  <div class="table-page__wrapper"
       style="overflow: hidden;"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">
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

    <custom-table :col="col"
                  :data="tableData"
                  :height="tableHeight"
                  @cell-click="cellClick"
                  @current-change="currentChange"
                  :operation-list="operationList"
                  :expandOperationList="[]"
                  :v-loading="loading"
                  :expandShow="false"
                  ref="childTable"
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
import Sticky from '@/components/Sticky/index';

let col = [
  {
    prop: 'fileRealname',
    label: '预览图片',
    width: 150,
    fixed: 'left',
    required: true,
    disabled: true,
    type: 'img',
  },
  {
    prop: 'fileRealname',
    label: '图片名称',
    width: 150,
    required: true,
    type: 'uploadImg',
  },
  {
    prop: 'anchorType',
    label: '类型',
    width: 150,
    required: true,
    type: 'select',
    select: [{ label: '专题', value: 0 }, { label: '课程', value: 1 }],
  },
  {
    prop: 'anchorId',
    label: '专题或课程',
    hidden: true,
    width: 150,
    type: 'autocomplete',
    toggleProp: 'anchorType',
    getMethods: ['selectTopicByName', 'selectCourseByName'],
  },
  {
    prop: 'sort',
    label: '排序',
    width: 150,
    required: true,
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
      case 'anchorType':
        return cellValue ? '课程' : '专题';
        break;
      default:
        return cellValue;
    }
  } else {
    return '';
  }
};
let operationList = [
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
      sortList: [],
      cellClickKey: ['topicName'],
      delMethods: 'delBanner',
      getMethods: 'getBanner',
      editMethods: 'updateBanner',
      delInformationTest: '删除成功',
      delConfirmTest: '请确认是否停用此条信息',
      pageTotal: 0,
      editorProcessParams: function(params) {
        params.filePath = 'pavg2g658.bkt.clouddn.com';
        params.anchorId = params.autocomplete;
        return params;
      },
    };
  },
  computed: {
    formatter() {
      return formatter;
    },
  },
  components: {
    Sticky,
  },
  methods: {
    /**
     * 删除参数处理
     */
    delProcessParams(row) {
      return { id: row.id };
    },
    /*
      * 点击指定字段显示预览
     */
    cellClick(row, column, cell, event) {},
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
          this.editMethods = 'updateBanner';
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          break;
      }
    },
    addInfo() {
      this.editTitle = '新建信息';
      this.editMethods = 'createdBanner';
      this.selection = {};
      this.eiditDialogVisible = true;
    },
    parameterHandling() {
      return {};
    },
    afterGetData(res) {
      this.tableData = res || [];
      this.pageTotal = res.length;
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
