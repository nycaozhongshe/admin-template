import customCheckBox from '@/components/Table/check.vue';
import customEditorBox from '@/components/Table/editor.vue';

import customTable from '@/components/Table/customTable.vue';

import customSort from '@/components/Table/customSort.vue';

import customDalog from '@/components/Table/customDalog.vue';

import customSearch from '@/components/Table/customSearch.vue';

import resizeMixin from './resizeMixin';
export default {
  extends: resizeMixin,
  data() {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      pageTotal: 0,
      pageConfig: { first_page: 0, page_size: 100 },
      tableHeight: 500, //页脚 //总数
      searchType: '',
      searchKey: '',
      searchInputType: 'text',
      searchTypeList: [],
      filterKey: '',
      sortIcon: '',
      sort: '',
      sortType: '',
      /** //"1" 降序
       * disabled 编辑不显示
       * type  select date textarea
       */ col: '',
      selection: {},
      eiditDialogVisible: false,
      viewtDialogVisible: false, //保存点击行的信息 //编辑窗口 //查看窗口
      delMethods: null,
      editMethods: null,
      getMethods: null,
      /**
       * 点击单元格 显示查看窗口 可为多个
       */ cellClickKey: [],
      /**
       * 编辑窗口发送参数处理
       */
      editorProcessParams: null,
      delConfirmTest: '此操作将永久删除该信息',
      delInformationTest: '删除成功',
      toggleRowExpansionIndex: 0,
    };
  },
  components: {
    customEditorBox,
    customCheckBox,
    customTable,
    customSort,
    customDalog,
    customSearch,
  },
  methods: {
    /** 替代Create 方便覆盖 */
    initCreated() {
      this.getData();
    },
    /** 替代mounted 方便覆盖 */
    initMounted() {
      this.$nextTick(() => {
        this.calcTableHeight();
      });
    },
    /** 点击展开图标 */
    expandChange(params) {
      if (params.expandedRows.indexOf(params.row) >= 0) {
        this.toggleRowExpansionIndex = this.tableData.indexOf(params.row);
      }
    },
    /** 点击展开行 */
    currentChange(row) {
      this.toggleRowExpansionIndex = this.tableData.indexOf(row);
    },
    /** 点击展开行内容*/
    clickExpandContent(row) {
      this.toggleRowExpansionIndex = this.tableData.indexOf(row);
    },
    /** 获取搜索sortkey*/
    getSortData(params) {
      this.sort = params.sort;
      this.sortType = params.key;
      this.getData();
    },
    /** 获取搜索key*/
    getSearchKey(params) {
      this.searchType = params.searchType;
      this.searchKey = params.searchKey;
      this.getData();
    },
    /**
     * 升降序
     * @param  index  string
     */
    clickSort(index) {
      this.sortIcon = index;
      this.sort = index;
      if (this.sortType) {
        this.initPage();
        this.getData();
      }
    },
    /**
     * 排序关键词
     * @param row Object
     */
    clickSortrKey(row) {
      this.initPage();
      this.sortType = row.item.prop;
      this.getData();
    },
    /**
     * 初始化页脚
     */
    initPage() {
      (this.pageConfig.first_page = 0), (this.pageConfig.page_size = 100);
      this.currentPage = 1;
    },
    clearFilterKey() {
      this.searchType = '';
      this.searchKey = '';
      this.filterKey = '';
    },
    /**
     * 选择筛选字段
     * @param Object
     */
    clickFilterKey(row) {
      this.searchType = row.item.prop;
      this.filterKey = row.item.label;
    },
    /**
     * 窗口变化时重新计算高度
     */
    _initResize() {
      this.calcTableHeight();
    },
    /**
     * 点击指定字段显示预览
     */
    cellClick(row, column, cell, event) {
      if (this.cellClickKey.indexOf(column.property) >= 0) {
        this.selection = row;
        this.viewtDialogVisible = true;
      }
    },
    /**
     * 操作
     */
    changeInfo() {},
    /*
         * 计算表格的高度
         */
    calcTableHeight() {
      this.tableHeight = this.$refs.tablePageWraper.offsetHeight - 120;
    },
    /*
         * 点击页脚
         */
    handleCurrentChange(currentPage) {
      this.pageConfig.first_page =
        (currentPage - 1) * this.pageConfig.page_size;
    },

    searchParameterHandling() {
      let obj = {};
      obj[this.searchType] = this.searchKey;
      return obj;
    },
    /**
     * 关闭编辑窗口 重置数据
     */
    closeEditor() {
      this.$bus.$emit('edit-clear');
      this.$refs.editorRef.initData();
    },
    /**
     * 确认删除
     */
    delConfirm(row) {
      this.$confirm(this.delConfirmTest, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delInformation(row);
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    back() {
      this.$router.go(-1);
    },
    /**
     * 删除参数处理
     */
    delProcessParams(row) {
      return { id: row.id };
    },
    /**
     * 删除信息
     */
    delInformation(row) {
      this.$store
        .dispatch(this.delMethods, this.delProcessParams(row))
        .then(() => {
          this.$message({
            message: this.delInformationTest,
            type: 'success',
          });
          this.afterDelInformation();
        });
    },
    /**
     * 删除后执行
     */
    afterDelInformation() {
      this.getData();
    },
    /**
     * 分页 搜索 排序 处理
     */
    pageParameterHandling() {
      let params = {};
      if (this.searchKey && this.searchType) {
        (this.pageConfig.first_page = 0), (this.pageConfig.page_size = 100);
        this.currentPage = 1;
        params = Object.assign(this.searchParameterHandling(), this.pageConfig);
      } else {
        params = Object.assign({}, this.pageConfig);
      }
      if (this.sort && this.sortType) {
        params.sort = this.sort;
        params.sortType = this.sortType;
        params = Object.assign(params, this.pageConfig);
      }
      return params;
    },
    /**
     * 获取列表发送参数处理
     */
    parameterHandling() {
      return this.pageParameterHandling();
    },
    /**
     * 获取列表
     */
    getData() {
      this.loading = true;
      this.$store
        .dispatch(this.getMethods, this.parameterHandling())
        .then(res => {
          this.loading = false;

          this.$refs.table && (this.$refs.table.bodyWrapper.scrollTop = 0);
          this.$refs.childTable &&
            (this.$refs.childTable.$refs.table.bodyWrapper.scrollTop = 0);

          this.afterGetData(res);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    /**
     * 获取列表参数操作
     */
    afterGetData(res) {
      this.pageTotal = res.total;
      this.tableData = res.content;
    },
  },
  mounted() {
    this.initMounted();
  },
  created() {
    this.initCreated();
  },
  watch: {
    pageConfig: {
      handler: function() {
        this.getData();
      },
      deep: true,
    },
  },
  filters: {
    capitalize: function(value) {
      if (!value) return '请选择筛选字段';
      return value;
    },
  },
};
