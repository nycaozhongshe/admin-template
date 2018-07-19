<template>
  <div class="father user-list table-page__wrapper mini-course__wrapper"
       style="overflow: hidden;"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">
        课程列表
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
    prop: 'name',
    label: '课程名称',
    fixed: 'left',
    required: true,
    width: 150,
  },
  {
    prop: 'coverImg',
    label: '封面图',
    type: 'uploadImg',
    required: true,
    width: 150,
  },
  {
    prop: 'introduceImg',
    label: '介绍图',
    required: true,
    width: 150,
    type: 'uploadImg',
  },
  {
    prop: 'originalPrice',
    label: '原价',
    required: true,
    width: 150,
    type: 'number',
  },
  {
    prop: 'categoryId',
    label: '分类',
    required: true,
    width: 150,
    type: 'cascader',
    options: [],
  },
  {
    prop: 'currentPrice',
    label: '现价',
    required: true,
    type: 'number',
  },
  {
    prop: 'difficulty',
    label: '学习难度',
    required: true,
    type: 'number',
  },
  {
    prop: 'virtualLearnNum',
    label: '虚拟学习人数',
    required: true,
    type: 'number',
  },
  {
    prop: 'createTime',
    label: '创建时间',
    type: 'number',
    disabled: true,
    width: 150,
  },
];
let statusList = ['正常', '停用'];

// let searchTypeList = [
//   {
//     label: '姓名',
//     prop: 'name',
//   },
// ];
let formatter = function(row, column, cellValue, index) {
  if (cellValue === 0 || cellValue) {
    switch (column.property) {
      //账号状态
      case 'createTime':
        return cellValue;
        break;
      // lecturerName
      //创建时间
      case 'categoryId':
        return row.category.title;
        break;
      case 'deleted':
        return '删除';
        break;

      default:
        return cellValue;
    }
    //删除状态
  } else if (column.property === 'deleted') {
    return '正常';
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
  // {
  //   command: 'add',
  //   content: '添加到课程',
  // },
];
export default {
  name: 'user-list',
  extends: tableTemplate,
  data() {
    return {
      formatter,
      col,
      operationList,
      // searchType: 'name',
      editTitle: '编辑信息',
      cellClickKey: ['name'],
      delMethods: 'createOrUpdateCourse',
      editMethods: 'delCourse',
      getMethods: 'getCourseList',
      delConfirmTest: '请确认是否停用此条信息',
      delInformationTest: '停用成功',
      editorProcessParams: function(params) {
        delete params.category;
        params.categoryId = params.categoryId[1];
        return Object.assign({}, params);
      },
      //自定义
      courseVisible: false,
      checkboxData: [],
      selectedContent: [],
      formLabelAlign: {
        courseId: '',
        orderName: '',
        orderNum: '',
      },
      toCourseVisible: false,
    };
  },
  components: {},
  computed: {},
  methods: {
    /*
      * 点击指定字段显示预览
     */
    cellClick(params) {
      let { row, column, cell, event } = params;
      // if (this.cellClickKey.indexOf(column.property) >= 0) {
      //   this.selection = row;
      //   this.$router.push({
      //     path: 'courseDetail',
      //     query: {
      //       id: this.selection.id,
      //       name: this.selection.name,
      //     },
      //   });
      // }
    },
    changeInfo(command) {
      switch (command.command) {
        case 'view':
          this.editTitle = '编辑信息';
          this.selection = command.scope.row;
          this.viewtDialogVisible = true;
          break;
        case 'del':
          this.delConfirm(command.scope.row);
          break;
        case 'edit':
          this.editTitle = '编辑信息';
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          break;
        case 'add':
          this.selection = command.scope.row;
          this.toCourseVisible = true;
          break;
      }
    },
    addInfo() {
      this.editTitle = '新建信息';
      this.selection = {};
      this.eiditDialogVisible = true;
    },
    miniCoursePlateList() {
      this.$store.dispatch('getCourseTypeList', {}).then(res => {
        // this.col[4].options = res.map(item => {
        //   let children = item.categories.map(i => {
        //     return {
        //       label: i.title,
        //       value: i.id,
        //     };
        //   });
        //   let params = {
        //     label: item.title,
        //     value: item.id,
        //     children,
        //   };
        //   return params;
        // });
      });
    },
    /**
     * 获取列表参数操作
     */
    afterGetData(res) {
      console.log(res);
      this.pageTotal = res.total || 0;
      this.tableData = res.content || [];
    },
  },
  created() {
    this.miniCoursePlateList();
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
<style lang="scss">
.mini-course__wrapper {
  .el-table td:nth-child(2) {
    color: #66b1ff;
    cursor: pointer;
  }
}
</style>
