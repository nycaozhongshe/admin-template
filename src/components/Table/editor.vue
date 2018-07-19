<!--  -->
<template>
  <div class="editor-form--custom__wrapper">
    <el-form ref="editorForm"
             :model="formData"
             label-width="150px">
      <el-form-item :label="item.label"
                    v-for="(item,index) in col"
                    :prop="item.prop"
                    :key="index"
                    v-if="!item.disabled"
                    :rules="item.rules||[
              { required: item.required ? true: false, message: '该项为必填', trigger: 'change' }
          ]">
        <el-input v-if="!item.type||item.type === 'textarea'"
                  v-model="formData[item.prop]"
                  :type=" item.type === 'textarea' ? 'textarea' : 'text'"
                  :disabled="item.disabled"
                  autosize>
        </el-input>
        <el-input :disabled="item.disabled"
                  v-if="item.type === 'number'"
                  v-model.number="formData[item.prop]"
                  type="number"
                  :max="item.max"
                  :min="item.min">
        </el-input>
        <!-- :rows="3"-->

        <el-select v-else-if="item.type==='select'"
                   placeholder="请选择分类"
                   v-model="formData[item.prop]">
          <el-option :label="item.label"
                     :value="item.value"
                     v-for="(item,index) in item.select"
                     :key="index">{{item.label}}
          </el-option>
        </el-select>
        <el-date-picker v-else-if="item.type==='date'"
                        v-model="formData[item.prop]"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        type="date"
                        :disabled="item.disabled"
                        placeholder="选择日期">
        </el-date-picker>
        <el-checkbox-group v-model="formData[item.prop]"
                           v-else-if="item.type==='checkbox'"
                           class="checkbox">
          <el-checkbox name="type"
                       :label="item.value"
                       v-for="(item,index) in item.select"
                       :key="index">
            {{item.label}}
          </el-checkbox>
        </el-checkbox-group>

        <upload-img v-else-if="item.type==='uploadImg'"
                    :img-key="formData[item.prop]"
                    :prop="item.prop"
                    :key="item.prop"
                    @post-key="postKey">
        </upload-img>

        <el-cascader class="cascader__wrapper"
                     v-else-if="item.type==='cascader'"
                     :options="item.options"
                     v-model="formData[item.prop]">
        </el-cascader>

        <autocomplete v-else-if="item.type=='autocomplete'"
                      :prop="item.prop"
                      :data="formData[item.prop]"
                      :toggle-key="item.toggleProp"
                      :form-data="formData"
                      :get-methods="item.getMethods"
                      @post-key="postKey">
        </autocomplete>
        <!-- <div  v-else-if="item.type=='uploadVideo'">
          {{formData[item.prop]}} {{formData}}
        </div> -->
        <upload-video v-else-if="item.type=='uploadVideo'"
                      :video-key="formData[item.prop]"
                      :duration-props="item.durationProps"
                      :prop="item.prop"
                      @post-key="postKey"
                      :formData="formData">
        </upload-video>
      </el-form-item>
    </el-form>
    <div class="el-dialog__footer">
      <el-button type="primary"
                 @click="validate"
                 v-waves
                 :disabled="btnDisabled">
        确认
      </el-button>
      <el-button @click="initData"
                 v-waves
                 :disabled="btnDisabled">
        重置
      </el-button>
      <el-button type="primary"
                 @click="pass"
                 v-if="requrieCheck"
                 v-waves
                 :disabled="btnDisabled">
        通过
      </el-button>
      <el-button @click="refuse"
                 v-if="requrieCheck"
                 v-waves
                 :disabled="btnDisabled">
        拒绝
      </el-button> <br>

      <!-- <upload-img  imgid="idCardFrontImg" imgname="idCardFrontImg"  :token="qiniuToken" v-on:child-key="listenImgKey"></upload-img> -->
    </div>
  </div>
</template>

<script>
import check from '../Table/check.vue';
import uploadImg from '@/components/Table/uploadImg.vue';
import uploadVideo from '@/components/Table/uploadVideo.vue';
import autocomplete from '@/components/Table/autocomplete.vue';
import waves from '@/directive/waves'; // base on element-ui

export default {
  name: 'customEdit',
  extends: check,
  props: {
    col: {
      required: true,
      default: {},
    },
    data: {
      required: true,
      default: {},
    },
    submitMethods: {
      required: true,
      default: {},
    },
    editorProcessParams: {
      default: () => {
        return function(params) {
          return params;
        };
      },
    },
  },
  data() {
    return {
      btnDisabled: false,
    };
  },
  directives: { waves },

  components: {
    uploadImg,
    uploadVideo,
    autocomplete,
  },
  methods: {
    postKey(params) {
      this.formData[params.prop] = params.key;

      if (params.durationProps && params.duration) {
        this.formData[params.durationProps] = params.duration;
      }

      this.formData = Object.assign({}, this.formData);
    },
    /** 同意 */
    pass() {
      let params = Object.assign({}, this.formData);
      this.$emit('pass', params);
      this.close();
    },
    /** 拒绝 */
    refuse() {
      this.$emit('refuse', this.formData);
      this.close();
    },
    /** 提示 */
    confirm(msg) {
      this.$confirm('未修改内容是否关闭', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.close();
        })
        .catch(() => {});
    },
    /** 关闭 */
    close() {
      this.$emit('close-edit');
    },
    /** 刷新 */
    refreshList() {
      this.$emit('refresh-edit');
    },
    // editorForm
    validate() {
      this.$refs['editorForm'].validate(valid => {
        if (valid) {
          this.onSubmit();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onSubmit() {
      let params = Object.assign({}, this.formData);
      this.editorPosition(params);
    },
    /** 有通过拒绝 */
    editorPositionAfter() {
      this.refreshList();
      !this.requrieCheck && this.close();
    },
    editorPosition(params) {
      this.btnDisabled = true;
      this.$store
        .dispatch(this.submitMethods, this.editorProcessParams(params))
        .then(res => {
          this.$message.success('操作成功');
          this.btnDisabled = false;
          this.editorPositionAfter();
        })
        .catch(err => {
          this.btnDisabled = false;
          this.$message.error('服务器错误');
          console.log(err);
        });
    },
  },
};
</script>
<style lang='scss' >
.editor-form--custom__wrapper {
  .cascader__wrapper {
    width: 100%;
  }
}
</style>
