<template>
  <div class="loading-box">
    <p class="bottom-text-box" v-show="loadingData">
      <img class="loading-icon" src="./imgs/loading_rotate_icon.gif" alt="loading_icon"/>
      <span>正在加载更多数据...</span>
    </p>
    <p class="bottom-text-box" v-show="!hasNext">到底了，被你掏空了~</p>
  </div>
</template>

<script>
  export default {
    name: "ScrollLoading",
    props: {
      scrollEle: {
        type: [String, HTMLDivElement]
      },
      loadingData: {
        type: Boolean,
        default: false
      },
      hasNext: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    methods: {
      handleListData () {
        if (this.hasNext) {
          let totalHeight = this.scrollEle.scrollHeight;
          let seeHeight = this.scrollEle.offsetHeight;
          let scrollTop = this.scrollEle.scrollTop;
          if (scrollTop + seeHeight > totalHeight - 100) {
            if (!this.loadingData) {
              this.$emit('update:loadingData', true);
              this.$emit('getFileListData');
            }
          }
        }
      }
    },
    watch: {
      scrollEle (nowEle) {
        if (nowEle) {
          nowEle.addEventListener("scroll", () => {
            this.handleListData();
          });
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .loading-box{
    padding: 20px 0;
    .bottom-text-box {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: rgba(0,0,0,.5);
      .loading-icon {
        width: 30px;
        margin-right: 10px;
      }
    }
  }
</style>
