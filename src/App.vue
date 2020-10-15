<template>
  <div id="app">
    <!-- <div class="wrapper" :style="wrapperStyle"> -->
    <router-view></router-view>
    <!-- </div> -->
    <!--<div id="test" style="background-color: rgba(0, 0, 0, 0.3); color: #fff; font-size: 16px; position: fixed; left: 5px; top: 5px; z-index: 1000;">test</div>-->
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="scss">
@import "assets/css/app";
</style>
