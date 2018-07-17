//全局方法以 _ 开头

const globalMethods = {
  mounted() {
    this.$bus.$on('resize', () => {
      this._initResize();
    });

    this.$once('hook:beforeDestroy', ()=> {
      this.$bus.$off('resize');
    });
  },
  methods: {
    _initResize() {},
  },
};

export default globalMethods;
