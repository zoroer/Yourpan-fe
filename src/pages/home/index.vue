<template>
  <div class="home">
    <HomeAside :isCollapse="isCollapse"></HomeAside>
    <div :class="['home-main', isCollapse ? 'close' : 'open']">
      <header class="home-header">
        <i :class="['el-icon-s-operation', 'toggle-icon', isCollapse && 'close']" @click="changeCollapse"></i>
        <div class="user-box">
          <span class="user-name">用户名: {{userInfo.username}}</span>
        </div>
      </header>
      <div class="home-files-box">
        <div class="box-menu">
          <div class="menu-button">
            <UploadBox></UploadBox>
  <!--          <el-button size="small" icon="el-icon-upload">新建文件夹</el-button>-->
            <el-button size="small" icon="el-icon-download" @click="handleDownloadFile">下载</el-button>
            <el-button size="small" icon="el-icon-delete-solid" @click="handleDeleteFile">删除</el-button>
          </div>
          <div :class="[searchAttr.isOpen && 'open', 'menu-search']">
            <el-input
              v-model="searchAttr.val"
              class="search-input"
              @keyup.enter.native="handleSearch"
              @focus="handleSearchStatus(true)"
              @blur="handleSearchStatus(false)"
              placeholder="请输入搜索内容">
              <i
                slot="suffix"
                class="search-btn el-input__icon el-icon-search"
                @click="handleSearch">
              </i>
            </el-input>
          </div>
        </div>
        <FileList
          ref="fileListComponent"
          :reqData="reqData"
          @selectChange="handleSelectChange">
        </FileList>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@api/home';
import HomeAside from '@components/HomeAside'
import FileList from './components/File_List'
import UploadBox from './components/Upload_Box'
export default {
  name: "HomePage",
  components: {
    HomeAside,
    FileList,
    UploadBox
  },
  data: function () {
    return {
      searchAttr: {
        val: '',
        isOpen: false
      },
      isCollapse: false,
      userInfo: {
        username: '',
        email: ''
      },
      reqData: '',
      selectArr: []
    }
  },
  methods: {
    changeCollapse () {
      this.isCollapse = !this.isCollapse;
    },
    handleSearchStatus (status) {
      this.searchAttr.isOpen = status;
    },
    handleSearch () {
      this.reqData = this.searchAttr.val;
    },
    getUserInfo () {
      this.$service.get(API.getUserInfo, {}, {
        needAuth: true
      })
        .then(res => {
          this.userInfo = res.data;
        });
    },
    // 处理选择文件
    handleSelectChange (val) {
      this.selectArr = val;
    },
    download (href) {
      let a = document.createElement("a");
      a.download = 'name';
      a.href = href;
      a.click();
    },
    // 文件下载(支持批量)
    handleDownloadFile () {
      if (this.selectArr.length) {
        this.$service.post(API.downloadFile, {
          ids: this.selectArr
        }, {
          needAuth: true,
          hideErrMsg: true
        })
          .then(res => {
            this.download(res.data.links);
        })
          .catch(err => {
            const errName = err.data.err_ids.map(item => item.name);
            this.$message.error(`文件${errName.join('，')}删除失败，请重试!`);
          });
      } else {
        this.$message.warning('请先选择文件!');
      }
    },
    // 文件删除(支持批量)
    handleDeleteFile () {
      if (this.selectArr.length) {
        this.$confirm("确定删除文件吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }).then(() => {
            this.$service.post(API.deleteFile, {
              state: "deleted",
              ids: this.selectArr
            }, {
              needAuth: true,
              hideErrMsg: true
            })
              .then(res => {
                this.$refs.fileListComponent.getFileListData();
              })
              .catch(err => {
                const errName = err.data.err_ids.map(item => item.name);
                this.$message.error(`文件${errName.join('，')}删除失败，请重试!`);
              });
          })
          .catch(() => {});
      } else {
        this.$message.warning('请先选择文件!');
      }
    }
  },
  created() {
    this.getUserInfo();
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .home {
    height: 100vh;
    display: flex;
    align-items: center;
    min-width: 1120px;
    .home-main {
      height: 100%;
      &.close {
        width: calc(100% - 65px);
      }
      &.open {
        width: calc(100% - 150px);
      }
      .home-header {
        max-height: 60px;
        padding: 20px 50px 20px 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .toggle-icon {
          font-size: 24px;
          transition: all 0.3s linear;
          cursor: pointer;
          &.close {
            transform: rotateZ(-90deg);
          }
        }
      }
      .home-files-box {
        height: calc(100vh - 60px);
        display: flex;
        flex-direction: column;
        .box-menu {
          height: 45px;
          padding: 15px 20px 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .menu-button {
            display: flex;
            /deep/ .el-button {
              &.el-button--primary {
                background-color: #0a64fa;
                border-color: #0a64fa;
              }
            }
          }
          .menu-search {
            width: 250px;
            transition: all 0.3s ease-in-out;
            &.open {
              width: 400px;
              /deep/ .search-btn {
                color: #409eff;
                border-left: 1px solid #409eff !important;
              }
            }
            .search-input {
              width: 100%;
              .search-btn {
                cursor: pointer;
                border-left: 1px solid #eee;
              }
            }
          }
        }
      }
    }
  }
</style>
