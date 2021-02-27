/*
 * @Author: A9ia
 * @Date: 2021-02-02 08:47:29
 * @LastEditTime: 2021-02-09 08:12:15
 */
import { Context } from 'egg';

export default {
  success(this: Context, data: object = {}) {
    this.body = {
      success: 1,
      data,
    };
  },

  error(this: Context, status: number, error: string) {
    this.throw(status, error);
  },

  isLogin(this: Context) {
    return !!this.session.netId;
  },

  async getRole(this: Context) {
    if (this.isLogin()) {
      const user = await this.model.Users.findByPk(this.session.netId);
      if (!user) {
        return 0;
      }
      return <number>user.role;

    }
    this.error(403, '请登录');
    return 0;

  },

  validate(this: Context, ...args) {
    for (let i = 1; i < args.length; i++) {
      if (!args[i]) {
        this.throw(404, '参数为空');
      }
    }
    return;
  },

};
