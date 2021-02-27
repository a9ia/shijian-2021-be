import { Controller } from 'egg';

function fillZero(len: number) {
  const str = '' + len;
  if (len > 100) {
    return str;
  }
  if (len > 10) {
    return '0' + str;
  }
  return '00' + str;
}

function createTeamId(len: number, gkdw: number) {
  let id = 'xjtu';
  const date = new Date();
  const year = date.getFullYear;
  id = id + year + gkdw + fillZero(len);
  return id;
}

function createClothesKey(size: number) {
  const key = 'size: ';
  return key + size;
}

function createContent(comment: string, teamName: string) {
  return '您的队伍' + teamName + '审核失败，请修改信息后再次提交审核。\n修改意见如下:\n' + comment;
}

function createTestContent(comment: string, teamName: string) {
  return '很遗憾！您的队伍' + teamName + '未通过考核。意见如下:\n' + comment;
}
// 校级答辩相关，相关信息可更改
function createUpContent(teamName: string) {
  return '恭喜！您的队伍' + teamName + '被推荐到校级答辩';
}

/**
 * 问题：1. 怎么避免两个老师同时审核同一个队伍， 2. 队伍材料，分数的输入方案， 3. 创建电子文档， 4. 创建表格, 5. 上传文件
 * 挂靠单位的群
 * 一级权限：
 * create, upDetailedInfo, upNeeds
 * updateTeamInfo, upTest, acMyTeam, acIdTeam
 * 二级权限：
 * auditTeam, testTeam, recommandTeam, acAllInfo
 */

// TODO: 管理员分级！获取不同状态队伍！驳回权限！记录分数！
export default class TeamController extends Controller {
  async create() {
    const { ctx } = this;
    const { teamName, projectName, gkdw, teacher, targetPlace } = ctx.request.body;
    ctx.validate(teamName, projectName, gkdw, teacher, targetPlace);
    const len = await ctx.model.Datas.findOne({ where: { key: 'teamSum' } });
    if (!len) {
      ctx.throw(500, '服务器未初始化seeder');
      return;
    }
    const teamId = createTeamId(len.value, gkdw);
    await ctx.model.Teams.create({
      teamId,
      teamName,
      projectName,
      gkdw,
      teacher,
      targetPlace,
    });
    await ctx.model.Teammates.create({
      netId: ctx.session.netId,
      teamId,
      cap: 1,
      vice: 0,
    });
    await len.update({ value: len.value + 1 });
    ctx.success({ teamId });
    return;
  }
  /**
   * team的state在0 1 2 时全部处于未开始审核的状态。
   * 3/4/5 为待审核，审核失败，审核成功。
   * 5/6/7 为待考核，考核失败，考核通过。
   * 8 可为校级
   */

  // 前端使用该接口时，会跳转到team/teamId上来，由前端获取后传递给后端。
  async upDetailedInfo() {
    const { ctx } = this;
    const { teamId, description, purpose, background, units } = ctx.request.body;
    ctx.validate(teamId, description, purpose, background, units);
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
    await team.update({
      state: 1,
      teamDetails: {
        description,
        purpose,
        background,
        units,
      },
    });
    ctx.success({ teamId });
    return;
  }

  async upNeeds() {
    const { ctx } = this;
    const { teamId, flag, clothes } = ctx.request.body;
    ctx.validate(teamId, flag, clothes);
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
    await team.update({
      state: 2,
      teamNeed: {
        flag,
        clothes,
      },
    });
    for (let i = 0; i < clothes.length; i++) {
      let data = await ctx.model.Datas.findOne({ where: { key: createClothesKey(clothes[i]) } });
      if (!data) {
        data = await ctx.model.Datas.create({
          key: createClothesKey(clothes[i]),
          value: 0,
        });
      }
      await data.update({
        value: data.value + 1,
      });
    }
    ctx.success({ teamId });
    return;
  }
  // 此接口尽量减少使用
  async updateTeamInfo() {
    const { ctx } = this;
    const { teamId, teamName, projectName, gkdw, teacher, targetPlace, description, purpose, background, units, flag, clothes } = ctx.request.body;
    ctx.validate(teamId, teamName, projectName, gkdw, teacher, targetPlace, description, purpose, background, units, flag, clothes);
    const team = await ctx.model.Teams.findByPk(teamId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !leader) {
      ctx.error(403, '没有找到目标队伍！');
      return;
    }
    if (team.state > 4) {
      // TODO: 挂靠单位联系方式
      ctx.error(403, '提交审核后禁止更改，如欲修改请联系挂靠单位');
      return;
    }
    if (ctx.session.netId !== leader.netId) {
      ctx.error(403, '您不是该队伍的队长，没有权限操作！');
      return;
    }

    await team.update({
      teamName,
      projectName,
      gkdw,
      teacher,
      targetPlace,
      teamDetails: {
        description,
        purpose,
        background,
        units,
      },
      teamNeed: {
        flag,
        clothes,
      },
    });
    ctx.success({ teamId });
    return;
  }

  async upTest() {
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
    await team.update({
      state: 3,
    });
  }
  // 需要role(2) 可以添加gkdw的审核
  async auditTeam() {
    const { ctx } = this;
    const { teamId, suc, comment } = ctx.request.body;
    ctx.validate(teamId, suc, comment);
    const team = await ctx.model.Teams.findByPk(teamId);
    const user = await ctx.model.Users.findByPk(ctx.session.netId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !user || !leader) {
      ctx.error(403, '错误！请刷新网页!');
      return;
    }
    if (suc === '1') {
      await team.update({
        state: 5,
      });
      await ctx.model.Messages.create({
        content: '您的队伍' + team.teamName + '已经通过审核！出行愉快！',
        netId: leader.netId,
      });
    } else {
      await team.update({
        state: 4,
      });
      await ctx.model.Messages.create({
        content: createContent(comment, team.teamName),
        netId: leader.netId,
      });
    }
    ctx.success(team);
    return;
  }

  async testTeam() {
    const { ctx } = this;
    const { teamId, suc, comment } = ctx.request.body;
    ctx.validate(teamId, suc, comment);
    const team = await ctx.model.Teams.findByPk(teamId);
    const user = await ctx.model.Users.findByPk(ctx.session.netId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !user || !leader) {
      ctx.error(403, '错误！请刷新网页!');
      return;
    }
    if (suc === '1') {
      await team.update({
        state: 7,
      });
      await ctx.model.Messages.create({
        content: '您的队伍' + team.teamName + '已经通过考核！',
        netId: leader.netId,
      });
    } else {
      await team.update({
        state: 6,
      });
      await ctx.model.Messages.create({
        content: createTestContent(comment, team.teamName),
        netId: leader.netId,
      });
    }
    ctx.success(team);
    return;
  }

  async recommandedTeam() {
    const { ctx } = this;
    const { teamId } = ctx.request.body;
    ctx.validate(teamId);
    const team = await ctx.model.Teams.findByPk(teamId);
    const user = await ctx.model.Users.findByPk(ctx.session.netId);
    const leader = await ctx.model.Teammates.findOne({ where: { teamId, cap: 1 } });
    if (!team || !user || !leader) {
      ctx.error(403, '错误！请刷新网页!');
      return;
    }
    await team.update({
      state: 8,
    });
    await ctx.model.Messages.create({
      content: createUpContent(team.teamName),
      netId: leader.netId,
    });
    return;
  }

  async acAll() {
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
    let { count, rows } = await ctx.model.Teams.findAndCountAll();
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

  async acState() {
    const { ctx } = this;
    const { page, num, state } = ctx.query;
    ctx.validate(page, num, state);
    if (num <= 0 || num > 20) {
      ctx.error(403, '每页数量需要为正整数并不大于20');
      return;
    }
    if (page <= 0) {
      ctx.error(403, '页数需要为正整数');
      return;
    }
    let { count, rows } = await ctx.model.Teams.findAndCountAll({ where: {
      state,
    } });
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

  async acMyTeam() {
    const { ctx } = this;
    const netId = ctx.session.netId;
    const teammates = await ctx.model.Teammates.findAll({ where: { netId }, include: [{ association: 'teamInfo', attributes: [ 'teamName', 'projectName', 'state' ] }] });
    ctx.success(teammates);
    return;
  }

  async acIdTeam() {
    const { ctx } = this;
    const { teamId } = ctx.query;
    ctx.validate(teamId);
    if (!teamId) {
      ctx.error(403, '输入值为空');
      return;
    }
    const team = await ctx.model.Teams.findByPk(teamId);
    if (!team) {
      ctx.error(403, '未找到该队伍');
      return;
    }
    ctx.success(team);
    return;
  }

  async acTeammates() {
    const { ctx } = this;
    const { teamId } = ctx.query;
    ctx.validate(teamId);
    if (!teamId) {
      ctx.error(403, '输入值为空');
      return;
    }
    const team = await ctx.model.Teams.findByPk(teamId);
    if (!team) {
      ctx.error(403, '未找到该队伍');
      return;
    }
    ctx.success(team);
    return;
  }
  // 还有加入队伍删除队伍
  async delTeam() {
    const { ctx } = this;
    const netId = ctx.session.netId;
    const { teamId } = ctx.params;
    ctx.validate(teamId);
    if (!teamId) {
      ctx.error(403, '输入值为空');
      return;
    }
    const teammate = await ctx.model.Teammates.findOne({ where: { netId, teamId } });
    if (!teammate || teammate.cap !== 1) {
      ctx.error(403, '无权限！');
      return;
    }
    const team = await ctx.model.Teams.findByPk(teamId);
    if (team) {
      await team.destroy();
      ctx.success();
      return;
    }
    ctx.throw(403, '没有该队伍！');
  }

}
