<!--  -->
<template>
  <div class="version_warpper">
    <div v-loading="loading">
      <el-switch v-model="value"
                 class="switch"
                 :disabled="disabled"
                 @change="change"
                 active-text="审核版本"
                 inactive-text="线上版本">
      </el-switch>
    </div>

  </div>

</template>

<script>
import { getVersion, changeVersion } from '@/api/version';
export default {
  data() {
    return {
      value: false,
      disabled: false,
      loading: false,
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.getVersion();
  },

  methods: {
    async change(val) {
      this.disabled = true;
      let res = await changeVersion({ auditPrice: Number(val) });
      this.disabled = false;
    },
    async getVersion() {
      this.loading = true;
      let res = await getVersion({});
      this.value = Boolean(res);
      this.loading = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.switch {
  margin-top: 20px;
}
.version_warpper{
  padding: 20px;
}
</style>
