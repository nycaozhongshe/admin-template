<!--  -->
<template>
  <el-dialog :title="title"
             :visible.sync="customDialogShow"
             width="50%"
             @close="afterClose"
             @open="open">
    <slot></slot>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="submit">{{ cancelText}}
      </el-button>

      <el-button @click="cancel">{{definiteText}}

      </el-button>
    </div>

  </el-dialog>
</template>

<script>
export default {
  props: {
    /** dalog 开关 */
    visible: {
      required: true,
    },
    /** title */
    title: {
      default: '提示',
    },
    /** 取消文字 */
    definiteText: {
      default: '取 消',
    },
    /** 确定文字 */
    cancelText: {
      default: '确 定',
    },
  },
  data() {
    return {
      customDialogShow: false,
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    open() {
      this.$emit('open');
    },
    /** 窗口关闭后 一般用来重置数据 */
    afterClose() {
      this.$emit('close');
    },
    /** 取消后关闭窗口  */
    cancel() {
      this.close();
    },
    /** 关闭窗口  */
    close() {
      this.$emit('update:visible', false);
    },
    /** 确定  */
    submit() {
      this.$emit('submit');
    },
  },
  watch: {
    /** 模拟v-model  */
    visible: {
      handler: function(val) {
        this.customDialogShow = val;
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss' scoped>
.dialog-footer {
  text-align: center;
}
</style>
