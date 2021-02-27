/*
 * @Author: A9ia
 * @Date: 2021-02-09 14:02:49
 * @LastEditTime: 2021-02-09 15:02:24
 */
import { Controller } from 'egg';
/**
 * invite - getInviteList, invite, deleteInvite
 * join - join, exit
 * vice cap - setVice tranCap
 */
export default class TeammateController extends Controller {
  async invite() {
    const { ctx } = this;
    const { teammates, teamId } = ctx.request.body;
    ctx.validate(teammates, teamId);
    const team = await ctx.model.Teams.findByPk(teamId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !leader) {
      ctx.error(403, '没有找到目标队伍！');
      return;
    }
    if (ctx.session.netId !== leader.netId) {
      ctx.error(403, '您不是该队伍的队长，没有权限操作！');
      return;
    }
    if (teammates.length === 0) {
      ctx.throw(403, '邀请人员为空');
    }
    // 或许应该加入邀请成员，创建队伍等的上限, 避免有人恶意注入数据
    // TODO: 又一个用到群的地方
    for (let i = 0; i < teammates.length; i++) {
      if (teammates[i].length > 15) {
        ctx.throw(403, `学号 ${teammates[i]} 不符合规范，如检查后未有错误请联系学院群上报！`);
      }
      await ctx.model.Messages.create({
        netId: teammates[i],
        content: '队伍' + team.teamName + '邀请您加入！',
        target: teamId,
      });
    }
    ctx.success();
    return;
  }

  async acInviteList() {
    const { ctx } = this;
    const { teamId } = ctx.request.body;
    ctx.validate(teamId);
    const team = await ctx.model.Teams.findByPk(teamId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !leader) {
      ctx.error(403, '没有找到目标队伍！');
      return;
    }
    if (ctx.session.netId !== leader.netId) {
      ctx.error(403, '您不是该队伍的队长，没有权限操作！');
      return;
    }
    const list = await ctx.model.Messages.findAll({ where: { target: teamId } });
    ctx.success(list);
    return;
  }

  async join() {
    const { ctx } = this;
    const { teamId, suc } = ctx.request.body;
    ctx.validate(teamId);
    const message = await ctx.model.Messages.findOne({ where: { netId: ctx.session.netId, target: teamId } });
    if (!message) {
      ctx.throw(403, '您并没有收到邀请！');
      return;
    }
    if (suc === '1') {
      await message.update({
        hasread: 1,
      });
      await ctx.model.Teammates.create({
        netId: ctx.session.netId,
        teamId,
      });
      return;
    }
    await message.update({
      hasread: 2,
    });
  }

  async exit() {
    const { ctx } = this;
    const { teamId } = ctx.request.body;
    const netId = ctx.session.netId;
    ctx.validate(teamId);
    const team = await ctx.model.Teams.findByPk(teamId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    const teammate = await ctx.model.Teammates.findOne({ where: { teamId, netId } });
    const me = await ctx.model.Users.findByPk(netId);
    if (!me) {
      ctx.throw(403, '请完善个人信息');
      return;
    }
    if (!team || !leader || !teammate) {
      ctx.error(403, '您并不在队伍中或队伍不存在！');
      return;
    }
    if (netId !== leader.netId) {
      teammate.destroy();
      await ctx.model.Messages.create({
        netId,
        content: '您的队员' + me.name + '离开了' + team.teamName,
      });
      ctx.success();
      return;
    }
    const vice = await ctx.model.Teammates.findOne({ where: { teamId, vice: 1 } });
    if (!vice) {
      ctx.throw(403, '请指认一名副队长在你离队后接任队长或者解散队伍');
      return;
    }
    await vice.update({
      vice: 0,
      cap: 1,
    });
    await ctx.model.Messages.create({
      netId: vice.netId,
      content: '由于队长离队，您已成为' + team.teamName + '的队长',
    });
    return;
  }

  async setVice() {
    const { ctx } = this;
    const { teamId, viceId } = ctx.request.body;
    ctx.validate(teamId, viceId);
    const team = await ctx.model.Teams.findByPk(teamId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !leader) {
      ctx.error(403, '没有找到目标队伍！');
      return;
    }
    if (ctx.session.netId !== leader.netId) {
      ctx.error(403, '您不是该队伍的队长，没有权限操作！');
      return;
    }
    const teammate = await ctx.model.Teammates.findOne({ where: { teamId, netId: viceId } });
    if (!teammate) {
      ctx.error(403, '未找到该队员');
      return;
    }
    if (teammate.vice === 1) {
      ctx.error(202, '该人已经是副队长');
      return;
    }
    teammate.update({ vice: 1 });
    await ctx.model.Messages.create({
      netId: viceId,
      content: '您被设置为' + team.teamName + '的副队长',
    });
    ctx.success();
    return;
  }

  async tranCap() {
    const { ctx } = this;
    const { teamId, capId } = ctx.request.body;
    ctx.validate(teamId, capId);
    const team = await ctx.model.Teams.findByPk(teamId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !leader) {
      ctx.error(403, '没有找到目标队伍！');
      return;
    }
    if (ctx.session.netId !== leader.netId) {
      ctx.error(403, '您不是该队伍的队长，没有权限操作！');
      return;
    }
    const teammate = await ctx.model.Teammates.findOne({ where: { teamId, netId: capId } });
    if (!teammate) {
      ctx.error(403, '未找到该队员');
      return;
    }
    teammate.update({ cap: 1 });
    leader.update({ cap: 0 });
    await ctx.model.Messages.create({
      netId: capId,
      content: '您被设置为' + team.teamName + '的队长',
    });
    ctx.success();
    return;
  }
}
