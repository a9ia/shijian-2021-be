/*
 * @Author: A9ia
 * @Date: 2021-02-09 15:01:42
 * @LastEditTime: 2021-02-27 17:11:33
 */
import { Controller } from 'egg';
export default class RecruitController extends Controller {
  async create() {
    const { ctx } = this;
    const { title, content, type } = ctx.request.body;
    const netId = ctx.session.netId;
    ctx.validate(title, content, type);
    if (type === '1' || type === '0') {
      await ctx.model.Recruits.create({
        title,
        content,
        netId,
        type,
      });
      ctx.success();
    }
    ctx.throw(403, '类型参数错误！');
    return;
  }

  // 管理员或者发布人
  async del() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.validate(id);
    const netId = ctx.session.netId;
    const user = await ctx.model.Users.findByPk(netId);
    if (user) {
      const comment = await ctx.model.Recruits.findByPk(id);
      if (comment && (netId === comment.netId || user.role >= 2)) {
        comment.destroy();
        ctx.success();
        return;
      }
      ctx.throw(403, '无权限或者招募不存在');
      return;
    }
    ctx.throw(403, '用户不存在');
    return;
  }
  // type: 0 team need teammate, type: 1 student find team
  async get() {
    const { ctx } = this;
    const { page, num, type } = ctx.query;
    ctx.validate(page, num, type);
    if (num <= 0 || num > 20) {
      ctx.error(403, '每页数量需要为正整数并不大于20');
      return;
    }
    if (page <= 0) {
      ctx.error(403, '页数需要为正整数');
      return;
    }
    let { count, rows } = await ctx.model.Recruits.findAndCountAll({ where: { type } });
    const mostPage = Math.ceil(count / num);
    if (page > mostPage) {
      ctx.error(403, '已超过最大页数！');
      return;
    }
    if (count <= num) {
      ctx.success({
        rows,
        mostPage,
      });
      return;
    }
    rows = rows.slice(num * (page - 1), num * page);
    ctx.success({
      rows,
      mostPage,
    });
    return;
  }

  async getMy() {
    const { ctx } = this;
    const { page, num } = ctx.query;
    ctx.validate(page, num);
    if (num <= 0 || num > 20) {
      ctx.error(403, '每页数量需要为正整数并不大于20');
      return;
    }
    if (page <= 0) {
      ctx.error(403, '页数需要为正整数');
      return;
    }
    let { count, rows } = await ctx.model.Recruits.findAndCountAll({ where: { netId: ctx.session.netId } });
    const mostPage = Math.ceil(count / num);
    if (page > mostPage) {
      ctx.error(403, '已超过最大页数！');
      return;
    }
    if (count <= num) {
      ctx.success({
        rows,
        mostPage,
      });
      return;
    }
    rows = rows.slice(num * (page - 1), num * page);
    ctx.success({
      rows,
      mostPage,
    });
    return;
  }
}
