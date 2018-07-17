<!--  -->
<template>
  <div></div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace({
        path: from.path,
        params: from.params,
        query: from.query,
      });
    });
  },
};
</script>
<style lang='scss' scoped>
</style>
