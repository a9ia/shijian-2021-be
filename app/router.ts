/*
 * @Author: A9ia
 * @Date: 2021-01-26 15:00:18
 * @LastEditTime: 2021-02-09 07:44:36
 */
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const { role } = middleware;
  // role(1)登录即可，role(2)管理员可， role(3)为超级管理员接口

  // 这一部分是有问题的，cas系统在校外不方便调试，只能日后再说
  router.get('/api', controller.user.login);
  router.post('/api', role(1), controller.user.loginCallBack);
  router.put('/api', role(1), controller.user.userinfoupdate);
  router.delete('/api', role(1), controller.user.logout);

  router.post('/api/team', controller.team.create);
};
