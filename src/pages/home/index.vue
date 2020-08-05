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
            <el-button size="small" icon="el-icon-download">下载</el-button>
            <el-button size="small" icon="el-icon-delete-solid">删除</el-button>
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
          :reqData="reqData">
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
      reqData: ''
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
