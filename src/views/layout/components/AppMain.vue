<template>
  <section class="app-main">
    <transition name="fade-transform"
                mode="out-in">
      <keep-alive exclude="courseDetail">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
};
</script>

