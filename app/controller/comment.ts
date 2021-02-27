/*
 * @Author: A9ia
 * @Date: 2021-02-09 15:01:23
 * @LastEditTime: 2021-02-27 17:11:49
 */
import { Controller } from 'egg';

export default class CommentController extends Controller {
  async create() {
    const { ctx } = this;
    const { title, content } = ctx.request.body;
    const netId = ctx.session.netId;
    ctx.validate(title, content);
    await ctx.model.Comments.create({
      title,
      content,
      netId,
    });
    ctx.success();
    return;
  }
  // administrator
  async response() {
    const { ctx } = this;
    const { response, id } = ctx.request.body;
    ctx.validate(id, response);
    const comment = await ctx.model.Comments.findByPk(id);
    if (comment) {
      comment.update({
        read: 1,
        response,
      });
      ctx.success();
      return;
    }
    ctx.throw(403, '未找到该评论');
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
      const comment = await ctx.model.Comments.findByPk(id);
      if (comment && (netId === comment.netId || user.role >= 2)) {
        comment.destroy();
        ctx.success();
        return;
      }
      ctx.throw(403, '无权限或者评论不存在');
      return;
    }
    ctx.throw(403, '用户不存在');
    return;
  }

  async get() {
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
    let { count, rows } = await ctx.model.Comments.findAndCountAll();
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
    let { count, rows } = await ctx.model.Comments.findAndCountAll({ where: { netId: ctx.session.netId } });
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
