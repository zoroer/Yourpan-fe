<!--
 * @fileoverview  homeAside组件
 * @author haihan |
 * @version 1.0 | 2020-06-30 | haihan
-->

<template>
  <div :class="['aside-box', isCollapse ? 'close' : 'open']">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <i :class="['logo', isCollapse ? 'close' : 'open']"></i>
      <el-menu
        :show-timeout="200"
        default-active="1"
        :collapse="isCollapse"
        mode="vertical"
        background-color="transparent"
        text-color="#637282"
        active-text-color="#0a64fa">
        <template v-for="(menuItem, index) in menuList">
          <el-menu-item :index="String(index + 1)">
            <i :class="menuItem.icon"></i>
            <span slot="title">{{menuItem.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data: function () {
    return {
      menuList: [{
        name: '全部文件',
        icon: 'el-icon-document'
      }, {
        name: '回收站',
        icon: 'el-icon-delete'
      }]
    }
  }
}
</script>
<style lang="less" scoped>
  .aside-box {
    position: relative;
    height: 100%;
    background-color: #f5f7f9;
    text-align: center;
    transition: width 0.3s linear;
    &.open {
      width: 150px;
    }
    &.close {
      width: 65px;
    }
    .logo {
      padding: 0 10px;
      display: inline-block;
      width: 100%;
      background: url(./imgs/logo.png) center no-repeat;
      background-size: contain;
      box-sizing: border-box;
      transition: height 0.3s linear;
      &.open {
        height: 120px;
      }
      &.close {
        height: 80px;
      }
    }
    .el-scrollbar {
      position: absolute;
      font-size: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
      .el-menu {
        border-right: 0;
        /deep/ .el-menu-item {
          &:hover {
            background-color: rgba(204, 204, 204, 0.2) !important;
          }
          span {
            display: inline-block;
            min-width: 60px;
            text-align: left;
          }
        }
      }
    }
  }
</style>
