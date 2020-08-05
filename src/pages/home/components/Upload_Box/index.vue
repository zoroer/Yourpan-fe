<template>
  <div class="container">
    <div class="upload-btn-box">
      <input type="file" class="input-file" accept="*/*" @change="handleUpdateFile">
      <el-button class="input-file-btn" type="primary" size="small" icon="el-icon-upload">上传</el-button>
    </div>

    <!-- 上传列表盒子 -->
    <div class="uploading-box" v-show="showListBox">
      <div class="upload-box-title">
        <p class="title-text">上传列表</p>
        <p class="menu-box">
          <i :class="['menu-icon', 'menu-mini', !showAllList ? 'el-icon-view' : 'el-icon-minus']" @click="handleListBox"></i>
          <i class="menu-icon menu-close el-icon-close" @click="showListBox=false"></i>
        </p>
      </div>
      <div :class="['upload-list-main', showAllList && 'show']">
        <div class="list-box upload-list-title">
          <p class="list-name">文件名</p>
          <p class="list-size">大小</p>
          <p class="list-status">状态</p>
          <p class="list-flow">进度</p>
        </div>
        <div class="list-box" v-for="(file, key) in uploadListStatus">
          <p class="list-name">{{file.name}}</p>
          <p class="list-size">{{file.size | handleSizeShow}}</p>
          <p class="list-status">{{file.status === 0 ? '上传中...' : '上传成功'}}</p>
          <p class="list-flow">{{file.percent + "%"}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from '@api/home/upload';
  import { getFileSize, priceHandle } from '@common/util';
  import { getToken } from '@common/publicSource/auth';
  import axios from "axios";
  export default {
    name: "UploadBox",
    data: function () {
      return {
        showAllList: true,
        showListBox: true,
        // 以每个文件uploadId为key
        uploadErrQueue: [],
        // 每个上传文件包含：文件名，大小，状态，速度，上传百分比
        uploadListStatus: {},
        uploadFileShowData: {
          index: -1,
          uploadId: '',
          name: '',
          size: '',
          status: 0, // 0上传中，1上传成功
          speed: '',
          percent: 0
        }
      }
    },
    filters: {
      handleSizeShow (size) {
        return getFileSize(size);
      }
    },
    methods: {
      getUploadId() {
        this.$service.get(API.getUploadId, {
          name: this.uploadFileShowData.name,
          size: this.uploadFileShowData.size
        }, {
          needAuth: true
        })
          .then(res => {
            this.uploadFileShowData.uploadId = res.data.upload_id;
            return this.uploadFileShowData.uploadId;
          });
      },
      // 重置上传列表文件默认显示数据
      resetUploadShowData () {
        this.uploadFileShowData = {
          index: 0,
          uploadId: 0,
          name: '',
          size: '',
          status: -1,
          speed: '',
          percent: '0'
        }
      },
      // 文件MD5
      handleUpdateFile (e) {
        const file = e.target.files[0];
        const blobSlice = File.prototype.slice || File.prototype.webkitSlice;
        const chunkSize = 300 * 1024;
        let chunkBegin = 0;
        let chunkEnd = 0;
        let fileReader;
        this.uploadFileShowData.name = file.name;
        this.uploadFileShowData.size = file.size;

        while (chunkEnd < file.size) {
          fileReader = new FileReader();
          chunkEnd = chunkBegin + chunkSize;
          let sliceBlob = blobSlice.call(file, chunkBegin, chunkEnd, file.type);
          chunkBegin = chunkEnd;
          fileReader.onloadend = async () => {
            this.uploadFileShowData.index = this.uploadFileShowData.index + 1;
            this.uploadFileShowData.index === 0 && await this.getUploadId();
            await this.fileReq(fileReader.result, sliceBlob);
          };
          fileReader.onerror = () => {
            new Error('读取文件失败！');
          };
          fileReader.readAsBinaryString(sliceBlob);
        }
      },
      // 文件上传
      fileReq (sliceBinaryString, sliceBlob) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          let sliceMD5 = this.$sparkMD5.hashBinary(sliceBinaryString);
          formData.append('id', this.uploadFileShowData.uploadId);
          formData.append('index', this.uploadFileShowData.index);
          formData.append('slideMD5', sliceMD5);
          formData.append('slideBinary', sliceBlob);

          xhr.open("POST", API.uploadFile);
          xhr.responseType = "json";
          xhr.setRequestHeader('Authorization', getToken());
          xhr.onloadend = () => {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
              this.uploadListStatus[this.uploadFileShowData.uploadId] = this.uploadFileShowData;
              resolve();
            } else {
              new Error('上传报错！');
              reject();
            }
          }
          xhr.onprogress = this.uploadProgress;
          xhr.send(formData);
        });
      },
      // 文件上传中
      uploadProgress (e) {
        if (e.lengthComputable) {
          let completedPercent = Number(this.uploadFileShowData.percent) + (e.loaded / this.uploadFileShowData.size);
          this.uploadFileShowData.percent = priceHandle(completedPercent * 100);
        }
      },
      handleListBox () {
        this.showAllList = !this.showAllList;
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    margin-right: 10px;
    .upload-btn-box {
      display: inline-block;
      position: relative;
      height: 32px;
      vertical-align: middle;
      .input-file {
        height: 100%;
        width: 73px;
        position: absolute;
        opacity: 0;
        font-size: 0;
        cursor: pointer;
      }
    }
    .uploading-box {
      position: fixed;
      bottom: 0;
      right: 10px;
      width: 633px;
      background-color: #fff;
      z-index: 99;
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
      border: 1px solid #e2e2e2;
      box-shadow: 0 0 10px #ccc;
      .upload-box-title {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-text {
          color: #666;
          font-size: 15px;
          margin-left: 10px;
        }
        .menu-box {
          font-size: 16px;
          line-height: 20px;
          color: #999;
          margin: 0 10px 0 2px;
          .menu-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
      .upload-list-main {
        display: none;
        &.show {
          display: block;
          min-height: 350px;
        }
        .list-box {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eee;
          height: 49px;
          line-height: 49px;
          color: #424e67;
          font-size: 12px;
          padding: 0 12px;
          box-sizing: border-box;
          &.upload-list-title {
            height: 35px;
            line-height: 35px;
            font-size: 13px;
            color: #909399;
          }
          .list-name {
            flex-basis: 55%;
          }
          .list-size {
            flex-basis: 12%;
          }
          .list-flow {
            flex-basis: 21%;
          }
          .list-status {
            flex-basis: 12%;
          }
        }
      }
    }
  }
</style>
