<template>
  <div class="upload-video__wrapper">
    <div v-if="!uploadShow">
      <el-input v-model="videoKey"
                class="input__warpper"
                readonly>
      </el-input>
      <el-button type="text"
                 @click="showingUpload">{{videoKey?"更换":"上传"}}</el-button>
    </div>
    <div v-else>
      <input @change="addFile"
             type="file"
             name="file"
             accept="audio/*,video/*"
             :id="getTime()"
             multiple/>
      <el-progress :percentage="percentage"></el-progress>
      <div class="options__warpper">
        <el-button type="text"
                   @click="upLoad">
          开始上传
        </el-button>
        <el-button type="text"
                   @click="clear">
          取消
        </el-button>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';
export default {
  name: 'uploadVideo',
  props: {
    prop: {},
    formData: {},
    'video-key': {},
    durationProps: {},
  },
  data() {
    return {
      uploadShow: false,
      fileList: [],
      percentage: 0,
      childrenProps: '',
      model: '',
      //
      uploadAuth: '',
      uploadAddress: '',
      videoId: '',
      videoDuration: 0,
    };
  },
  computed: {
    ...mapGetters(['UP_LOAD_VIDEO_LIST']),
  },
  methods: {
    ...mapMutations(['ADD_UPLAOD_VIDEO_ITEM', 'DEL_UPLAOD_VIDEO_ITEM']),
    getTime() {
      return new Date().getTime() + this.getRandom(0, 999999999999);
    },
    initVideo() {},
    //获取视频时长
    getFileInfoDuration() {
      var myVideos = [];
      //////////////////////////
      myVideos.push(this.fileList[0]);
      var video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        var duration = video.duration;
        myVideos[myVideos.length - 1].duration = duration;
        this.videoDuration = myVideos[0].duration;
        //获取视频 秒数
      };
      video.src = URL.createObjectURL(this.fileList[0]);
    },
    //升级视频详情
    getRandom(min, max) {
      var r = Math.random() * (max - min);
      var re = Math.round(r + min);
      re = Math.max(Math.min(re, max), min);
      return re;
    },
    addFile(event) {
      this.fileList = event.target.files;
      for (let i = 0; i < event.target.files.length; i++) {
        this.uploader.addFile(
          event.target.files[i],
          null,
          null,
          null,
          JSON.stringify(this.userData),
        );
      }
    },
    upLoad() {
      if (!this.fileList || this.fileList.length <= 0) {
        this.$message('请选择上传视频');
        return;
      }
      if (!this.formData.name) {
        this.$message('请先输入课时名');
        return;
      }
      //
      this.getFileInfoDuration();
      //
      this.$store
        .dispatch('createVideoUpToken', {
          name: this.fileList[0].name,
          title: this.formData.name || '未输入标题',
          videoId: this.videoKey ? this.videoKey : null,
        })
        .then(res => {
          let data = res;
          this.uploadAuth = data.uploadAuth;
          this.uploadAddress = data.uploadAddress;
          this.videoId = data.videoId;
          this.childrenProps = Object.assign(
            {},
            { key: this.videoId, prop: this.prop },
          );

          //重新赋值
          this.uploader.options.onUploadSucceed = this.onUploadSucceed;
          this.uploader.options.onUploadstarted = this.onUploadstarted;
          this.uploader.startUpload();
        })
        .catch(() => {
          this.$message.error('上传失败，获取token');
          this.loadding = false;
        });
    },
    clear() {
      this.DEL_UPLAOD_VIDEO_ITEM(this.prop);
      this.uploadShow = false;
      this.videoId = '';
      this.fileList = [];
      this.percentage = 0;
      this.uploader.cleanList();
    },
    showingUpload() {
      if (JSON.stringify(this.UP_LOAD_VIDEO_LIST) != '{}') {
        this.$message('请完成已有上传');
        return;
      }
      this.ADD_UPLAOD_VIDEO_ITEM(this.prop);
      this.uploader = new AliyunUpload.Vod({
        //分片大小默认1M，不能小于100K
        partSize: 1048576,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {},
        //全部文件上传结束
        onUploadEnd: function(uploadInfo) {},
      });
      this.uploader.options.onUploadFailed = this.onUploadFailed;
      this.uploader.options.onUploadProgress = this.onUploadProgress;
      this.uploadShow = true;
    },
    // 文件上传成功
    onUploadSucceed(uploadInfo, a, b, c, d) {
      this.$message.success('上传成功');
      this.postKey();
      this.clear();
    },
    // 文件上传失败
    onUploadFailed(uploadInfo, code, message) {
      this.$message.error('上传失败');
      this.clear();
    },
    // 开始上传
    onUploadstarted(uploadInfo) {
      console.log('开始上传');
      //上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
      try {
        this.uploader.setUploadAuthAndAddress(
          uploadInfo,
          this.uploadAuth,
          this.uploadAddress,
          this.videoId,
        );
        // uploader.startUpload();
      } catch (err) {
        console.log(err);
      }
      //上传方式2
      // uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret,secretToken);
    },
    // 文件上传进度，单位：字节
    onUploadProgress(uploadInfo, totalSize, loadedPercent) {
      this.percentage = parseInt(loadedPercent * 100);
    },
    postKey() {
      this.$emit(
        'post-key',
        Object.assign(
          {},
          {
            key: this.videoId,
            prop: this.prop,
            durationProps: this.durationProps,
            duration: this.videoDuration,
          },
        ),
      );
    },
  },
  mounted() {
    this.$bus.$on('edit-clear', () => {
      this.clear();
    });
  },
  beforeDestroy() {
    this.$bus.$off('edit-clear');
  },
  watch: {
    videoKey(val) {
      this.model = val;
    },
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
