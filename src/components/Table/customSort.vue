<!--  -->
<template>
  <el-dropdown trigger="click"
               v-if="sortList&&sortList.length"
               @command="clickSortrKey">
    <span class="el-dropdown-link">
      排序
    </span>
    <i class="el-icon-sort"
       @click="clickSort('1')"
       v-if="sortIcon===''">
    </i>

    <i class="el-icon-sort-down"
       @click="clickSort('2')"
       v-else-if="sortIcon==='1'">
    </i>

    <i class="el-icon-sort-up"
       @click="clickSort('')"
       v-else-if="sortIcon==='2'">
    </i>

    <el-dropdown-menu slot="dropdown"
                      class="dropdown-key">
      <el-dropdown-item divided
                        v-for="(item,index) in sortList"
                        :key="index"
                        :command='{item,index}'>
        {{item.label}}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: ['sortList'],
  data() {
    return {
      sortIcon: '',
      row: {},
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    /** 点击下拉框选择  */
    clickSortrKey(row) {
      this.row = row;
      this.postData();
    },
    /** 点击拍寻图标  */
    clickSort(index) {
      this.sortIcon = index;
      this.postData();
    },
    postData() {
      this.$emit('post-sort-data', {
        sort: this.sortIcon,
        key: this.row.item ? this.row.item.prop : '',
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
