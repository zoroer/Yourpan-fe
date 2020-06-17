<template>
  <div class="box">
    <h1>other page</h1>
  </div>
</template>

<script>
  export default {
    name: "Vue"
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
