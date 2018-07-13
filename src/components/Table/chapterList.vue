
<template>
  <div>
    <el-card class="box-card">
      <div v-for="(item,index) in sections"
           :key="index"
           class="item">
        <div>
          <span class="text">课时名 : {{item.name }} </span>
          <span class="text"> 类型 : {{contentType(item.contentType) }}</span>
          <span class="text"> 排序 : {{item.sort }}</span>
          <span class="text"> 预览设置 : {{ free(item.free) }}</span>
        </div>
        <div class="operation">
          <el-button type="text"
                     @click="editInfo(item)">
            编辑
          </el-button>
          <el-button type="text"
                     @click="delInfo(item)">
            删除
          </el-button>
        </div>

      </div>
      <div v-if=" !sections||!sections.length">
        暂无内容
      </div>
      <!-- <div style="text-align:center">
        <el-button type="text"
                   @click="delInfo(item)">
          新增课时
        </el-button>
      </div> -->

    </el-card>
  </div>
</template>

<script>
let sectionCol = [
  {
    prop: 'name',
    label: '课时名',
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
    label: '试看',
    width: 100,
  },
  {
    prop: 'contentType',
    label: '内容类型',
    width: 100,
    required: true,
  },
];
export default {
  props: {
    list: {
      default: [],
    },
  },
  data() {
    return {
      courseId: '',
      sections: [],
    };
  },
  mounted() {},
  methods: {
    free(type){
      return type ? '试看' : '收费';
    },
    contentType(type) {
      return type ? '习题' : '音视频';
    },
    editInfo(item) {
      item.courseId = this.list.courseId;
      item.chapterId = this.list.id;
      this.$emit('edit-info', Object.assign({}, item));
    },
    delInfo(item) {
      this.$emit('del-info', item);
    },
  },
  watch: {
    list: {
      handler(val) {
        this.sections = val.sections;
        this.chapterId = val.id;
      },
      immediate: true, // 立马执行一次handler
      deep: true,
    },
  },
};
</script>

<style lang="scss" >
.box-card {
  font-size: 12px;
  text-align: left;
  .el-card__header,
  .el-card__body {
    padding: 10px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 50px;
    .text {
      margin-right: 20px;
      display: inline-block;
    }
    .text:nth-child(1) {
      min-width: 280px;
    }
    .text:nth-child(2) {
      min-width: 72px;
    }
    .text:nth-child(3) {
      min-width: 52px;
    }
  }
}
</style>

