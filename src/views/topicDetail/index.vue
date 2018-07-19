<template>
  <div class="father user-list table-page__wrapper special-topic-management-detail__wrapper"
       style="overflow: hidden;"
       ref="tablePageWraper">
    <div class="table-page-header__wrapper">
      <span class="title">
        <el-button size="mini"
                   @click="back"
                   class="clear">
          返回
        </el-button>
        专题名称:{{$route.query.name||"暂无名称"}}
      </span>

      <custom-search @search="getSearchKey"
                     :search-type-list="searchTypeList"
                     @choosing-course="choosingCourse"
                     :button-type="['choosingCourse']">
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
    <el-pagination class="table-page-footer"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage"
                   :page-size="pageConfig.page_size"
                   layout="total, prev, pager, next"
                   :total="pageTotal">
    </el-pagination>

    <custom-dalog title="选择课程"
                  @submit="addCourse"
                  @close="closeSelectCourseShow"
                  @open="openSelectCourse"
                  :visible.sync="selectCourseShow">

      <select-course @post-to-course="acceptToCourseList"
                     :select-course-show="selectCourseShow"
                     :topic-id="$route.query.id"
                     ref="selectCourse">
      </select-course>

    </custom-dalog>
  </div>
</template>

<script>
import { formatDate } from '@/assets/methods';
import tableTemplate from '@/components/common/tableTemplate.js';
import { dateFtt } from '@/assets/methods';
import selectCourse from '@/components/miniProgram/SpecialTopicManagementDetail/selectCourse';

let col = [
  // {
  //   prop: 'id',
  //   label: 'uid',
  //   width: 300,
  //   fixed: 'left',
  //   disabled: true,
  // },
  {
    prop: 'name',
    label: '课程名称',
    fixed: 'left',
    width: 300,
  },
  {
    prop: 'coverImg',
    label: '封面图',
    type: 'uploadImg',
    width: 150,
  },
  {
    prop: 'introduceImg',
    label: '介绍图',
    width: 300,
    type: 'uploadImg',
  },
  {
    prop: 'originalPrice',
    label: '原价',
    width: 300,
    type: 'number',
  },
  {
    prop: 'currentPrice',
    label: '现价',
    type: 'number',
  },
  {
    prop: 'difficulty',
    label: '学习难度',
    type: 'number',
  },
  {
    prop: 'virtualLearnNum',
    label: '虚拟学习人数',
    type: 'number',
  },
];
let statusList = ['正常', '停用'];

let searchTypeList = [
  // {
  //   label: "姓名",
  //   prop: "name"
  // }
];

let formatter = (row, column, cellValue, index) => {
  if (cellValue === 0 || cellValue) {
    switch (column.property) {
      case 'categoryId':
        return row.category.title;
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
      selectCourseShow: false,
      cellClickKey: ['topicName'],
      delMethods: 'delMIniCourseInTopic',
      getMethods: 'miniCourseInTopicList',
      editMethods: 'addMIniCourseInTopic',
      delInformationTest: '停用成功',
      delConfirmTest: '请确认是否停用此条信息',
      editorProcessParams: function(params) {
        delete params.code;
        delete params.msg;
        delete params.data;
        return params;
      },
      //
      userList: {},
      selectCourseList: [],
    };
  },
  components: {
    selectCourse,
  },
  computed: {
    formatter() {
      return formatter;
    },
  },
  mounted() {},
  methods: {
    openSelectCourse() {
      this.$refs.selectCourse.getData();
    },
    acceptToCourseList(selection) {
      this.selectCourseList = selection;
    },
    closeSelectCourseShow() {
      this.$refs.selectCourse.clearSelection();
      this.selectCourseShow = false;
    },
    addCourseParameterHandling() {
      let arr = this.selectCourseList.map(item => {
        return {
          topicId: this.$route.query.id,
          courseId: item.id,
        };
      });
      return { params: arr };
    },
    addCourse() {
      if (!this.selectCourseList || !this.selectCourseList.length) {
        this.$message('请选择课程');
        return;
      }
      this.selectCourseShow = false;
      this.$store
        .dispatch(this.editMethods, this.addCourseParameterHandling())
        .then(res => {
          if (res.data.code == '0') {
            this.getData();
          } else {
            this.$message('添加失败，服务器错误');
          }
        })
        .catch(error => {
          this.$message('添加失败，请重试');
        });
    },
    /*
     * 选择课程
     */
    choosingCourse() {
      this.selectCourseShow = true;
    },
    /*
     * 点击指定字段显示预览
     */
    cellClick() {},
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
          this.selection = command.scope.row;
          this.eiditDialogVisible = true;
          break;
      }
    },

    /**
     * 删除参数处理
     */
    delProcessParams(row) {
      return { courseId: row.id };
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch(
          this.getMethods,
          Object.assign(this.parameterHandling(), {
            topicId: this.$route.query.id,
          }),
        )
        .then(res => {
          this.loading = false;
          if (res.data.code == '0') {
            if (this.$refs.table) this.$refs.table.bodyWrapper.scrollTop = 0;
            this.tableData = res.data.data.content;
            this.pageTotal = res.data.data.total;
          }
        });
    },
  },
  watch: {
    '$route.query.id'() {
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
.table-page__wrapper .table-page-header__wrapper .title {
  width: 300px;
}
</style>
