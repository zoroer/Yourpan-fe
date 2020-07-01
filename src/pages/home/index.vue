<template>
  <div class="home">
    <HomeAside :isCollapse="isCollapse"></HomeAside>
    <div class="home-main">
      <header class="home-header">
        <i :class="['el-icon-s-operation', 'toggle-icon', isCollapse && 'close']" @click="changeCollapse"></i>
        <div class="user-box">
          <span class="user-name">用户名: AAA</span>
        </div>
      </header>
      <div class="home-files-box">
        <div class="box-menu">
          <div class="menu-button">
            <el-button type="primary" size="small" icon="el-icon-upload">上传</el-button>
  <!--          <el-button size="small" icon="el-icon-upload">新建文件夹</el-button>-->
            <el-button size="small" icon="el-icon-download">下载</el-button>
            <el-button size="small" icon="el-icon-delete-solid">删除</el-button>
          </div>
          <div :class="[searchAttr.isOpen && 'open', 'menu-search']">
            <el-input
              v-model="searchAttr.val"
              class="search-input"
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
        <div class="box-files-main">
          <div class="empty-box" v-if="!fileList.length">
            <i class="empty-icon"></i>
            <p class="empty-text">暂无文件，赶紧去上传吧~</p>
          </div>
          <div class="files-content" v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@api/home';
import HomeAside from '@components/HomeAside'
export default {
  name: "HomePage",
  components: {
    HomeAside
  },
  data: function () {
    return {
      searchAttr: {
        val: '',
        isOpen: false
      },
      isCollapse: false,
      fileList: []
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
      console.log(this.searchAttr.val);
    }
  },
  created() {
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .home {
    height: 100vh;
    display: flex;
    align-items: center;
    .home-main {
      height: 100%;
      flex-grow: 1;
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
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .menu-button {
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
        .box-files-main {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          .empty-box {
            text-align: center;
            .empty-icon {
              display: inline-block;
              height: 130px;
              width: 130px;
              background: url("./imgs/empty_icon.png") no-repeat;
              background-size: cover;
              margin-top: -110px;
            }
            .empty-text {
              margin-top: 10px;
              font-size: 13px;
              line-height: 1;
              color: #637282;
              text-indent: 20px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }
  }
</style>
