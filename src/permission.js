import router from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

//路由守卫-判断登陆状态
router.beforeEach(({ name }, from, next) => {
  // document.body.scrollTop = 0;
  NProgress.start(); // start progress bar
  if (name != 'login') {
    if (JSON.parse(sessionStorage.getItem('logged'))) {
      next();
    } else {
      next('/login');
    }
  } else {
    NProgress.done();
    sessionStorage.removeItem('logged');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    next();
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
  NProgress.done(); // finish progress bar
});
