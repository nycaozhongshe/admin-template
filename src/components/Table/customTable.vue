<!--  -->
<template>
  <!-- :default-expand-all="true" -->
  <el-table class="table-page-content"
            :data="data"
            v-loading="vLoading"
            border
            stripe
            :height="height"
            size="small"
            highlight-current-row
            @cell-click="cellClick"
            @expand-change="expandChange"
            @current-change="currentChange"
            ref="table"
            style="width: 100%">
    <el-table-column type="expand"
                     fixed="left"
                     v-if="expandShow">
      <template slot-scope="props">
        <div @click="clickExpandContent(props.row)"
             style="width:100%">
          <custom-table :data="props.row.categories"
                        :col="col"
                        size="mini"
                        :operation-list="expandOperationList"
                        :formatter="formatter"
                        :expandShow="false"
                        class="expand-content__warpper"
                        @change-info="changeInfoType">
          </custom-table>
        </div>
      </template>
    </el-table-column>

    <el-table-column type="expand"
                     fixed="left"
                     v-else-if="courseShow">
      <template slot-scope="props">
        <template>
          <div @click="clickExpandContent(props.row)">
            <chapter-list :list="props.row"
                          @edit-info="editSection"
                          @del-info="delSection">
            </chapter-list>
          </div>
        </template>
      </template>
    </el-table-column>

    <el-table-column type="index"
                     fixed="left"
                     width="50"
                     :key="'index'">
    </el-table-column>

    <template v-for="(item,index) in col">

      <el-table-column :key="index"
                       :fixed="item.fixed?item.fixed:false"
                       v-if="item.type !=='img'&& !item.hidden"
                       :prop="item.prop"
                       :label="item.label"
                       :formatter="formatter"
                       :show-overflow-tooltip="true"
                       :min-width="item.width">
      </el-table-column>

      <el-table-column :key="index"
                       v-if="item.type ==='img'"
                       :min-width="item.width"
                       :label="item.label">
        <template slot-scope="scope">
          <div v-if="scope.row.coverUrl">
            <img :src="scope.row.coverUrl"
                 class="img-size"
                 alt="">
          </div>

          <div v-if="scope.row.fileRealname">
            <img :src="'http://'+ scope.row.filePath +'/'+  scope.row.fileRealname"
                 class="img-size"
                 alt="">
          </div>
        </template>
      </el-table-column>
    </template>

    <el-table-column fixed="right"
                     label="操作"
                     v-if="!noOperation"
                     align="right"
                     :width="240">
      <template slot-scope="scope">

        <div v-if="operationList.lenth>3">
          <el-dropdown @command="changeInfo"
                       trigger="click">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command='{scope,command:item.command}'
                                v-for=" (item,index) in operationList"
                                :key="index">{{item.content}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else>
          <el-button v-for=" (item,index) in operationList"
                     :type="item.type || 'success'"
                     @click="changeInfo({scope,command:item.command})"
                     :key="index"
                     size="mini">
            {{item.content}}
          </el-button>
        </div>
      </template>

    </el-table-column>

    <el-table-column fixed="right"
                     label="新增课时"
                     v-if="addSectionShow"
                     width="100">
      <template slot-scope="scope">
        <el-button type="primary"
                   class="add-section"
                   v-waves
                   @click='changeInfo({scope,command:"addSection"})'>
          新增课时
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import chapterList from './chapterList';
import waves from '@/directive/waves'; // base on element-ui

export default {
  name: 'customTable',
  props: {
    expandShow: {
      default: false,
    },
    data: {
      default: [],
    },
    height: {
      default: null,
    },
    col: {
      required: true,
    },
    /**操作选项 */
    operationList: {
      default: [],
    },
    /**格式化数据 */
    formatter: {},

    /**不显示操作 */
    noOperation: {
      default: false,
    },
    'v-loading': {
      default: false,
    },
    'expand-operation-list': {
      default: function() {
        return [];
      },
    },
    /** 课程列表 */
    'course-show': {
      default: false,
    },
    /** 添加课时 */
    addSectionShow: {
      default: false,
    },
  },
  data() {
    return {};
  },
  directives: { waves },

  components: { chapterList },

  computed: {},

  mounted() {},

  methods: {
    clickExpandContent(row) {
      this.$emit('click-expand-content', row);
    },
    currentChange(currentRow) {
      this.$emit('current-change', currentRow);
    },
    expandChange(row, expandedRows) {
      this.$emit('expand-change', { row, expandedRows });
    },
    editSection(item) {
      this.$emit('edit-section', item);
    },
    delSection(item) {
      this.$emit('del-section', item);
    },
    changeInfo(command) {
      this.$emit('change-info', command);
    },
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', { row, column, cell, event });
    },
    /** 子内容触发增删改 */
    changeInfoType(command) {
      this.$emit('change-info-type', command);
    },
    initWidth(){
      console.log(this.$refs.table)
    }
  },
};
</script>
<style lang='scss' scoped>
.img-size {
  width: 85%;
  height: 100px;
}
</style>
<style lang='scss' >
.table-page-content {
  .el-table__expanded-cell[class*='cell'] {
    padding: 0px 0 0 50px;
  }
  .add-section {
    padding: 6px;
  }
}
.expand-content__warpper {
  font-size: 12px;
  .el-table__header-wrapper {
    display: none;
  }
}
.miniCourseType__wrapper .expand-content__warpper.el-table td {
  color: #333;
  font-weight: 500;
  .el-dropdown-link {
    color: #333;
    font-size: 12px;
  }
}
</style>
