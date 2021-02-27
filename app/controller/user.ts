/*
 * @Author: A9ia
 * @Date: 2021-01-26 22:00:07
 * @LastEditTime: 2021-02-09 08:31:44
 */
import { Controller } from 'egg';

export default class UserController extends Controller {
  async login() {
    this.service.cas.login();
  }

  async loginCallBack() {
    const { ctx } = this;
    const { guid } = ctx.request.body;
    ctx.validate(guid);
    this.service.cas.loginCallBack(guid, ctx.session.secret);
  }

  async userinfoupdate() {
    const { ctx } = this;
    const netId = ctx.session.netId;
    const { userinfo } = ctx.request.body;
    const user = await ctx.model.User.findByPk(netId);
    if (!user) {
      ctx.status = 404;
      return;
    }
    await user.update({
      phone: userinfo.phone,
      // name: userinfo.name,
      // college: userinfo.college,
      // grade: userinfo.grade,
      // class: userinfo.class
    });
    ctx.body = {
      success: 1,
      data: user,
    };
    return;
  }

  async logout() {
    this.ctx.session = null;
    this.ctx.success();
  }
}
