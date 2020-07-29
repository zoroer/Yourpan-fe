<template>
  <div class="home-file-box" ref="tableBox">
    <el-table
      :data="tableData"
      class="table-list"
      height="100vh-175px">
      <!-- 处理列表为空 -->
      <template slot="empty">
        <div class="empty-box">
          <i class="empty-icon"></i>
          <p class="empty-text">暂无文件，赶紧去上传吧~</p>
        </div>
      </template>
      <el-table-column
        prop="filename"
        label="文件名"
        min-width="55%">
        <template slot-scope="scope">
          <img class="file-icon" :src="scope.row.type | handleFileIcon" alt="file_icon">
          <span class="file-name">{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        min-width="20%">
        <template slot-scope="scope">
          <span>{{ scope.row.size | handleFileSize}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="修改日期"
        min-width="20%">
      </el-table-column>
      <!-- 自定义元素插入table最后 -->
      <ScrollLoading
        v-if="!tableData.length"
        slot="append"
        :scrollEle="scrollEle"
        :loadingData.sync="loadingData"
        :hasNext="hasNext"
        @getFileListData="handleScrollReq">
      </ScrollLoading>
    </el-table>
  </div>
</template>

<script>
import API from '@api/home';
import { getFileSize } from '@common/util';
import fileIconMap from './file-icon-map';
import ScrollLoading from '../Scroll_Loading';
export default {
  name: "FileList",
  components: {
    ScrollLoading
  },
  props: {
    reqData: {
      type: [String, Number],
      default: 'false'
    }
  },
  data: function () {
    return {
      tableData: [],
      hasNext: false,
      loadingData: false,
      tableForm: {
        page_index: 0,
        page_size: 15,
        keywords: ''
      },
      scrollEle: ''
    }
  },
  methods: {
    getFileListData () {
      this.$service.get(API.getFileListData, this.tableForm, {
        needAuth: true
      })
        .then(res => {
          this.tableData = this.tableData.concat(res.data);
          this.hasNext = res.meta.pagination.hasNext;
          this.loadingData = false;
        }, (err) => {
          this.loadingData = false;
        });
    },
    handleScrollReq () {
      this.tableForm.page_index++;
      this.getFileListData();
    }
  },
  filters: {
    handleFileSize (fileSize) {
      return getFileSize(fileSize);
    },
    handleFileIcon (fileType) {
      return fileIconMap[fileType];
    }
  },
  created() {
    this.getFileListData();
  },
  mounted() {
    this.scrollEle = this.$refs.tableBox.querySelector('.el-table__body-wrapper');
  },
  watch: {
    reqData (nowData) {
      if (nowData) {
        this.tableForm.page_index = 0;
        this.tableForm.keywords = nowData;
        this.getFileListData();
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .home-file-box {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    overflow-y: scroll;
    /deep/ .el-table__empty-block {
      min-height: calc(100vh - 175px);
    }
    &::-webkit-scrollbar {
      width: 0;
    }
    .table-list {
      font-size: 12px;
      .file-icon {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 20px;
        height: 20px;
        object-fit: cover;
      }
      .file-name {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
      }
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
</style>
