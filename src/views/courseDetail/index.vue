<template>
  <div class="father career-list table-page__wrapper miniCourseType__wrapper"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">
        <el-button size="mini"
                   @click="back"
                   class="clear"
                   style="margin-right:12px;">
          返回
        </el-button>
        课程名称:{{$route.query.name||"暂无名称"}}

        <!-- <custom-sort :sort-list="sortList"
                     @post-sort-data="getSortData">
        </custom-sort> -->
      </span>
      <custom-search :search-type-list="searchTypeList"
                     @search="getSearchKey"
                     @add="addInfo"
                     :button-type="['add']">
      </custom-search>
    </div>

    <custom-table :col="coltable"
                  :data="tableData"
                  :height="tableHeight"
                  @cell-click="cellClick"
                  @expand-change="expandChange"
                  @current-change="currentChange"
                  @click-expand-content="clickExpandContent"
                  :operation-list="operationList"
                  :formatter="formatter"
                  v-loading="loading"
                  :courseShow="true"
                  ref="childTable"
                  @del-section="delSection"
                  @edit-section="editSection"
                  :addSectionShow="true"
                  @change-info="changeInfo">
    </custom-table>

    <el-pagination class="table-page-footer"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-size="pageConfig.page_size"
                   layout="total, prev, pager, next"
                   :total="pageTotal">
    </el-pagination>

    <el-dialog :visible.sync="eiditDialogVisible"
               class="eiditor__wrapper"
               @close="closeEditor"
               :title="editTitle"
               width="50%"
               center>

      <custom-editor-box :col="editCol"
                         ref="editorRef"
                         :data="selection"
                         :submitMethods="editMethods"
                         @close-edit="eiditDialogVisible=false"
                         :editorProcessParams="editorProcessParams"
                         @refresh-edit="getData">
      </custom-editor-box>

    </el-dialog>
    <el-dialog class="eiditor__wrapper"
               :title="editTitle"
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
    prop: 'name',
    label: '章节名',
    width: 150,
    required: true,
  },
  {
    prop: 'sort',
    label: '排序',
    width: 100,
    required: true,
    type: 'number',
  },
];

let sectionCol = [
  {
    prop: 'name',
    label: '课时名',
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
    prop: 'free',
    label: '预览设置',
    required: true,
    width: 100,
    type: 'select',
    select: [{ label: '付费', value: 0 }, { label: '试看', value: 1 }],
  },
  {
    prop: 'audioId',
    label: '课时音频',
    required: true,
    width: 100,
    type: 'uploadVideo',
  },
  {
    prop: 'videoId',
    label: '课时视频',
    width: 100,
    required: true,
    type: 'uploadVideo',
    durationProps: 'duration',
  },
  {
    prop: 'coursewareUrl',
    label: '课件图片',
    width: 100,
    required: true,
    type: 'uploadImg',
  },
];
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
  {
    command: 'addSection',
    content: '新增课时',
  },
];
let searchTypeList = [];
export default {
  name: 'chapter-list',
  extends: tableTemplate,
  data() {
    return {
      coltable: col,
      sectionCol,
      editCol: null,
      operationList,
      searchTypeList,
      filterKey: '',
      title: '课程分类列表',
      delMethods: 'delCourseChapter',
      editMethods: 'createOrUpdateCourseChapter',
      getMethods: 'getCourseChapterList',
      searchInputType: 'text',
      editTitle: '',
      labelsSelect: [],
      /**
       * 点击单元格 显示查看窗口 可为多个
       */
      cellClickKey: ['name'],
      /**
       * 编辑参数处理
       * @param  Object
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
    };
  },
  computed: {
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
    editSection(item) {
      this.editCol = this.sectionCol;
      this.editTitle = '编辑课时';
      this.editMethods = 'createOrUpdateCourseSection';
      this.selection = item;
      this.eiditDialogVisible = true;
    },
    delSection(row) {
      this.delMethods = 'delCourseSection';
      this.delConfirm(row);
    },
    //新增板块/类型
    addInfo() {
      this.editCol = this.coltable;
      this.editTitle = '新建章节';
      this.editMethods = 'createOrUpdateCourseChapter';
      this.selection = {
        courseId: this.$route.query.id,
      };
      this.eiditDialogVisible = true;
    },
    cellClick() {},
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
          this.editCol = this.coltable;
          this.editTitle = '编辑章节';
          this.editMethods = 'createOrUpdateCourseChapter';
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
        },
        del: () => {
          this.delMethods = 'delCourseChapter';
          this.delConfirm(command.scope.row);
        },
        /** 新增课程类型 */
        addSection: () => {
          this.editCol = this.sectionCol;
          this.editTitle = '新建课时';
          this.editMethods = 'createOrUpdateCourseSection';
          this.selection = {
            contentType: 0,
            courseId: command.scope.row.courseId,
            chapterId: command.scope.row.id,
          };
          this.eiditDialogVisible = true;
        },
      };
      operateMethods[command.command]();
    },
    /**
     * 获取列表发送参数处理
     */
    parameterHandling() {
      return { courseId: this.$route.query.id };
    },
    afterGetData(res) {
      this.tableData = res || [];
      if (this.$refs.childTable) {
        this.$refs.childTable.$refs.table.toggleRowExpansion(
          this.tableData[this.toggleRowExpansionIndex]
        );
      }
    },
  },
  created() {},
  watch: {
    '$route.query.id'(val) {
      if (val) {
        this.getData();
      }
    },
  },
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

<style scoped lang="scss">
.dropdown-key {
  border-color: #ccc;
}
.table-page__wrapper .table-page-header__wrapper .title {
  width: 300px;
}
</style>
