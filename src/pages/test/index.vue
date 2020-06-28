<template>
  <div class="box">
    <h1>test page</h1>
    <img src="./imgs/rect.png" alt="logo" />
  </div>
</template>

<script>
  import API from '@api/api';
  export default {
    name: "Vue",
    created() {
      this.$service.get(API.test)
        .then(res => {
          console.log(res);
        });
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .3rem;
    color: #f00;
    flex-direction: column;
    h1 {
      font-weight: bold;
    }
  }
</style>
