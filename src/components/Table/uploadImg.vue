<template>
  <div class="upload-video__wrapper">
    <div v-if="!uploadShow">
      <el-input v-model="imgKey"
                class="input__warpper"
                readonly>
      </el-input>
      <el-button type="text"
                 @click="showingUpload">
        {{imgKey?"更换":"上传"}}
      </el-button>
    </div>
    <div v-if="uploadShow"
         class="upload__warpper">
      <input @change="addFile"
             type="file"
             name="file"
             accept="image/*"
             :id="prop"
             multiple/>
      <el-progress :percentage="percentage"></el-progress>
      <div class="options__warpper">
        <el-button type="text"
                   @click="upLoad">
          开始上传
        </el-button>
        <el-button type="text"
                   @click="cancle">
          取消
        </el-button>
      </div>

    </div>

  </div>
</template>
<script>
import * as qiniu from 'qiniu-js';
import axios from 'axios';
export default {
  name: 'uploadVideo',
  props: {
    prop: {},
    'img-key': {},
  },
  data() {
    return {
      imgId: '',
      uploadShow: false,
      fileList: [],
      config: {
        useCdnDomain: false, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        region: qiniu.region.z0, // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
      },
      putExtra: {
        fname: '', //文件原文件名
        params: {}, //用来放置自定义变量
        mimeType: null,
      },
      type: '',
      percentage: 0,
    };
  },
  methods: {
    initVideo() {},
    cancle() {
      this.uploadShow = false;
      this.imgId = '';
      this.fileList = [];
    },
    addFile(event) {
      this.fileList = event.target.files;
    },
    getRandom(min, max) {
      var r = Math.random() * (max - min);
      var re = Math.round(r + min);
      re = Math.max(Math.min(re, max), min);
      return re;
    },
    getTime() {
      return (
        (new Date().getTime() + this.getRandom(1, 1000000000000)).toString(36) +
          '.' +
          this.type || 'jpg'
      );
    },
    upLoad() {
      this.loadding = true;
      /** 没内容直接取消 */
      if (!this.fileList || this.fileList.length <= 0) {
        this.$message('请选择上传图片');
        return;
      }
      this.type = this.fileList[0].type.split('/')[1];
      let that = this;
      let oldName = this.getTime();
      this.$store
        .dispatch('createImgUpToken', {
          oldName: oldName,
        })
        .then(res => {
          let token = res;
          var observable = qiniu.upload(
            this.fileList[0],
            oldName,
            token,
            this.putExtra,
            this.config,
          );
          observable.subscribe({
            next: res => {
              // 主要用来展示进度
              this.percentage = parseInt(res.total.percent);
              console.log(this.percentage);
            },
            error: err => {
              // 失败报错信息
              if (err.code === 614) {
                this.$message.error('图片已经存在');
              } else {
                this.$message.error('上传失败');
              }
              this.clear();
            },
            complete: res => {
              this.imgId = res.key;
              this.$message.success('上传成功');
              this.postKey();
              this.clear();
            },
          });
        })
        .catch(() => {
          this.$message.error('上传失败，获取token');
          this.loadding = false;
        });
    },
    clear() {
      this.uploadShow = false;
      this.imgId = '';
      this.fileList = [];
      this.percentage = 0;
    },
    showingUpload() {
      this.uploadShow = true;
    },
    postKey() {
      this.$emit('post-key', { key: this.imgId, prop: this.prop });
    },
  },
  mounted() {
    this.$bus.$on('edit-clear', () => {
      this.clear();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.upload-video__wrapper {
  .input__warpper {
    width: 90%;
  }
  .options__warpper {
    display: flex;
  }
}
</style>
