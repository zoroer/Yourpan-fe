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
        <div class="list-box" v-for="list in uploadListStatus" :key="list.name">
          <p class="list-name">{{list.name}}</p>
          <p class="list-size">{{list.size | handleSizeShow}}</p>
          <p class="list-status">{{list.status | handleResultText}}</p>
          <p class="list-flow">{{list.percent + "%"}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import API from '@api/home/upload';
  import { getFileSize, priceHandle } from '@common/util';
  import { getToken } from '@common/publicSource/auth';
  export default {
    name: "UploadBox",
    data: function () {
      return {
        showAllList: false,
        showListBox: false,
        isUploadEnd: false,
        uploadReqQueue: [],
        uploadListStatus: [],
        // 每个上传文件包含：文件名，大小，状态，速度，上传百分比
        uploadFileShowData: {
          sliceTotal: 0,
          uploadId: 0,
          name: '',
          size: '',
          status: 0, // 0上传中，1上传成功 2上传失败
          speed: '',
          percent: 0
        }
      }
    },
    filters: {
      handleSizeShow (size) {
        return getFileSize(size);
      },
      handleResultText (status) {
        const statusMap = {
          '0': '上传中...',
          '1': '上传成功',
          '2': '上传失败'
        };
        return statusMap[String(status)];
      }
    },
    methods: {
      // 重置上传列表文件默认显示数据
      resetUploadShowData () {
        this.uploadFileShowData = {
          sliceTotal: 0,
          uploadId: 0,
          name: '',
          size: '',
          status: 0,
          speed: '',
          percent: 0
        }
      },
      getUploadId() {
        return new Promise((resolve, reject) => {
          this.$service.get(API.getUploadId, {
            name: this.uploadFileShowData.name,
            size: this.uploadFileShowData.size
          }, {
            needAuth: true
          })
            .then(res => {
              this.uploadFileShowData.uploadId = res.data.upload_id;
              resolve(res.data.upload_id);
            });
        });
      },
      // 上传完成请求
      uploadEnd () {
        this.$service.get(API.uploadEnd, {
          id: this.uploadFileShowData.uploadId
        }, {
          needAuth: true
        })
          .then(res => {
            this.isUploadEnd = true;
            const uploadStatus = this.uploadReqQueue.some(item => item.result === 'failed');
            this.uploadListStatus.forEach((uploadingItem, index) => {
              if (uploadingItem.uploadId === this.uploadFileShowData.uploadId) {
                this.uploadListStatus[index].status = uploadStatus ? 2 : 1;
              }
            })
            this.resetUploadShowData();
            this.uploadReqQueue = [];
          });
      },
      // 文件MD5
      handleUpdateFile (e) {
        const file = e.target.files[0];
        const blobSlice = File.prototype.slice || File.prototype.webkitSlice;
        const chunkSize = 300 * 1024;
        let chunkBegin = 0;
        let chunkEnd = 0;
        let fileReader;
        let uploadIndex = -1;
        this.isUploadEnd = false;
        this.showListBox = true;
        this.showAllList = true;
        this.uploadFileShowData.sliceTotal = Math.ceil(file.size / chunkSize);
        this.uploadFileShowData.name = file.name;
        this.uploadFileShowData.size = file.size;

        this.getUploadId().then(uploadId => {
          while (chunkEnd < file.size) {
            fileReader = new FileReader();
            chunkEnd = chunkBegin + chunkSize;
            let sliceBlob = blobSlice.call(file, chunkBegin, chunkEnd, file.type);
            chunkBegin = chunkEnd;
            fileReader.onload = () => {
              uploadIndex++;
              this.fileReq(fileReader.result, sliceBlob, uploadId, uploadIndex);
            };
            fileReader.onerror = () => {
              new Error('读取文件失败！');
            };
            fileReader.readAsBinaryString(sliceBlob);
          }
        });
      },
      // 文件上传
      fileReq (sliceBinaryString, sliceBlob, uploadId, uploadIndex, reTry, index) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        let sliceMD5 = this.$sparkMD5.hashBinary(sliceBinaryString);
        formData.append('id', uploadId);
        formData.append('index', uploadIndex);
        formData.append('slideMD5', sliceMD5);
        formData.append('slideBinary', sliceBlob);
        reTry && formData.append('reTry', reTry);

        xhr.open("POST", API.uploadFile);
        xhr.responseType = "json";
        xhr.setRequestHeader('Authorization', getToken());
        xhr.onloadend = () => {
          // 是否最后一个分片请求
          const isReqEnd = (reTry || this.uploadReqQueue.length === this.uploadFileShowData.sliceTotal-1);
          const uploadingFile = this.uploadListStatus.filter(uploadingItem => {
            return uploadingItem.uploadId === uploadId;
          });

          if (xhr.status >= 200 && xhr.status < 300 && xhr.response.code === 1) {
            if (!reTry) {
              this.uploadReqQueue.push({ result: 'success' });
              !uploadingFile.length && this.uploadListStatus.push(this.uploadFileShowData);
            } else {
              this.uploadReqQueue[index].result = 'success';
            }
            isReqEnd && this.handleReqReTry();
          } else {
            if (!reTry) {
              !uploadingFile.length && this.uploadListStatus.push(this.uploadFileShowData);
              // 上传错误放到错误队列，等待重试
              this.uploadReqQueue.push({
                reTry: false,
                result: 'failed',
                sliceBinaryString,
                sliceBlob,
                uploadId,
                uploadIndex
              });
            }
            isReqEnd && this.handleReqReTry();
          }
        }
        xhr.upload.onprogress = this.uploadProgress;
        xhr.onerror = () => {
          this.uploadListStatus.forEach((uploadingItem, index) => {
            if (uploadingItem.uploadId === this.uploadFileShowData.uploadId) {
              this.uploadListStatus[index].percent = 0;
            }
          })
        };
        xhr.send(formData);
      },
      // 处理重传1次
      handleReqReTry () {
        let isAllHandle = this.uploadReqQueue.every(req => req.result === 'success' || req.reTry);
        if (isAllHandle && !this.isUploadEnd) {
          this.uploadEnd();
        } else {
          this.uploadReqQueue.forEach((errReq, index) => {
            if (!errReq.reTry) {
              errReq.reTry = true;
              this.fileReq(errReq.sliceBinaryString, errReq.sliceBlob, errReq.uploadId, errReq.uploadIndex, true, index);
            }
          });
        }
      },
      // 文件上传中
      uploadProgress (e) {
        if (e.isTrusted && e.lengthComputable) {
          let nowPercent = Number(this.uploadFileShowData.percent);
          let completedPercent = nowPercent + (e.loaded / this.uploadFileShowData.size);
          let finalPercent = completedPercent > 1 ? 1 : completedPercent;
          this.uploadFileShowData.percent = priceHandle(finalPercent * 100);

          this.uploadListStatus.forEach((uploadingItem, index) => {
            if (uploadingItem.uploadId === this.uploadFileShowData.uploadId) {
              this.uploadListStatus[index].percent = this.uploadFileShowData.percent;
            }
          })
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
