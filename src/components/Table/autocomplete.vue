<!--  -->
<template>
  <div>
    <el-autocomplete v-model="model"
                     :fetch-suggestions="querySearch"
                     placeholder="请输入内容"
                     class="autocomplete"
                     @select="handleSelect">
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  props: {
    prop: {},
    data: {},
    'toggle-key': {
      default: 0,
    },
    'get-methods': {
      type: Array,
      required: true,
    },
    'form-data': {},
  },

  data() {
    return {
      restaurants: [],
      model: '',
      modelToggle: true,
    };
  },

  components: {},

  computed: {
    toggleValue() {
      return this.formData[this.toggleKey];
    },
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    getRestaurants() {
      if (!this.toggleValue && this.toggleValue !== 0) {
        this.modelToggle && this.$message('请先选择分类');
        return;
      }
      let methods = this.getMethods[this.toggleValue];
      // selectTopicByName
      this.$store
        .dispatch(methods, { importName: this.model || '' })
        .then(res => {
          res = res || [];
          this.restaurants = res.map(item => {
            return {
              id: item.id,
              value: item.topicName || item.name,
            };
          });
        });
    },
    handleSelect(item) {
      this.postKey(item.id);
    },
    postKey(key) {
      this.$emit('post-key', { key, prop: 'autocomplete' });
    },
    clear() {
      this.model = '';
      this.restaurants = [];
    },
  },
  mounted() {
    this.$bus.$on('edit-clear', () => {
      this.modelToggle = false;
      this.clear();
      setTimeout(() => {
        this.modelToggle = true;
      }, 1000);
    });
  },
  beforeDestroy() {
    this.$bus.$off('edit-clear');
  },
  watch: {
    data: {
      handler(val) {
        if (this.model) return;
        this.model = val;
      },
      immediate: true, // 立马执行一次handler
    },
    model(val) {
      this.getRestaurants();
    },
    toggleValue(val) {
      if (val !== undefined) {
        this.getRestaurants();
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.autocomplete {
  width: 100%;
}
</style>
