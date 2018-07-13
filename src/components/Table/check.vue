<!--  -->
<template>
  <div>
    <el-form ref="editorForm"
             :model="formData"
             label-width="150px">
      <el-form-item :label="item.label"
                    v-for="(item,index) in col"
                    :prop="item.prop"
                    :key="index">
        <el-input v-if="!item.type||item.type === 'textarea'||item.type === 'number'"
                  v-model="formData[item.prop]"
                  :type=" item.type === 'textarea' ? 'textarea' : 'text'"
                  readonly
                  autosize>
        </el-input>
        <!-- :rows="3"-->

        <el-select disabled
                   v-else-if="item.type==='select'"
                   placeholder="请选择分类"
                   v-model="formData[item.prop]">
          <el-option :label="item.label"
                     :value="item.value"
                     v-for="(item,index) in item.select"
                     :key="index">{{item.label}}
          </el-option>
        </el-select>
        <el-date-picker readonly
                        v-else-if="item.type==='date'"
                        v-model="formData[item.prop]"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        type="date"
                        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  props: ['col', 'data', 'requrieCheck'],
  name: 'customView',
  data() {
    return {
      formData: {},
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    //初始化
    initData() {
      this.resetForm();
      let selectList = {};
      this.col.map(item => {
        if (item.type === 'checkbox') {
          if (this.data[item.prop] && this.data[item.prop].length) {
          } else {
            selectList[item.prop] = [];
          }
        }
        if (item.type === 'cascader' && item.prop === 'categoryId') {
          if (this.data[item.prop] && this.data[item.prop].length) {
            selectList[item.prop] = [ this.data.category.plateId,this.data[item.prop]];
          } else {
            selectList[item.prop] = [];
          }
        }
      });
      this.formData = Object.assign({}, this.data, selectList);
    },
    //重置
    resetForm(formName) {
      this.$refs['editorForm'].resetFields();
    },
  },
  watch: {
    data: {
      handler: function() {
        this.initData();
      },
      deep: true, //深度监听
    },
  },
};
</script>
<style lang="scss">
.eiditor__wrapper {
  .el-dialog {
    min-width: 660px;
    max-width: 700px;
    margin-top: 10vh !important;
    .el-dialog__header {
      // box-shadow: 0px 4px 4px #e1e1e1;
      border-bottom: 1px solid #ccc;
    }
    .el-form {
      max-height: 600px;
      overflow: auto;
      padding: 10px;
      .el-select {
        width: 100%;
      }
      .el-form-item__label {
        text-align: left;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
      }
      .el-input.is-disabled .el-input__inner {
        color: #606266;
      }
      .el-checkbox-group {
        label {
          margin-left: 0;
          padding-right: 10px;
          padding-left: 10px;
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
      margin: 10px -25px 0px;
      // box-shadow: 0px -4px 4px #e1e1e1;
      border-top: 1px solid #ccc;

      padding: 0;
      padding-top: 10px;
    }
  }
}
</style>

