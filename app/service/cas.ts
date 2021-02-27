import { Service } from 'egg';
import { HttpMethod, RequestOptions2 } from 'urllib';

function createHash(secret: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const hash = crypto.createHash('md5');
  hash.update(secret);
  return hash.digest('hex');
}

function createStr() {
  return Math.floor(Math.random() * 32768).toString();
}

export default class UserService extends Service {
  login() {
    const { ctx, config } = this;
    const secret = createHash(createStr());
    ctx.session.secret = secret;
    const callbackURL = config.url.frontEnd + config.url.redirectPage + '?secret=' + ctx.session.secret;
    this.ctx.redirect(config.url.server + encodeURIComponent(callbackURL));
  }

  async loginCallBack(guid: string, secret: string) {
    const { ctx } = this;
    const sessionSecret = ctx.session.secret;
    if (!guid || !secret || secret !== sessionSecret) {
      ctx.body = {
        data: '后端服务器错误' + guid + '\n secret:' + secret + '\n' + sessionSecret,
      };
      return;
    }
    let data:any;
    try {
      data = await this.loginCheck(guid);
    } catch (error) {
      ctx.body = {
        success: 0,
        data: 'api服务器错误',
      };
      return;
    }
    if (!data || !data.userid) {
      ctx.body = {
        success: 0,
        data: '服务器错误\n' + JSON.stringify(data),
      };
      return;
    }

    ctx.session.netId = data.userid;
    ctx.body = {
      success: 1,
      data,
    };
    return;
  }

  async httpRequest(method: HttpMethod, url: string, data?: object, additionalOptions?: RequestOptions2) {
    const DEFAULT_REQUEST_OPTIONS: RequestOptions2 = {
      contentType: 'json',
      dataType: 'json',
      timeout: [ 3000, 10000 ],
    };
    return await this.ctx.curl(url, {
      method,
      data,
      ...DEFAULT_REQUEST_OPTIONS,
      ...additionalOptions,
    });
  }

  async loginCheck(guid: string) {
    let res: any;

    try {
      res = await this.httpRequest('GET', this.config.url.server, { guid });
    } catch (e) {
      throw 'CAS API Server Connection Error: ' + e;
    }
    if (res.status !== 200) {
      throw 'API Server Bad HTTP Code: ' + res.status;
    }
    if (res.data.code !== 0) {
      throw 'API Server Error: ' + res.data.msg;
    }
    return res.data.data;
  }

  async usercreate(netId: string, userinfo: any) {
    const { ctx } = this;
    const role = 2;
    const user = await ctx.model.Users.findByPk(netId);
    if (!user) {
      await ctx.model.User.create({
        netId,
        name: userinfo.user_name,
        role,
        // phone: userinfo.phone,
        // college: userinfo.college,
        // grade: userinfo.grade,
        // class: userinfo.class
        // 该部分需要到学校后调试
      });
    }
    ctx.status = 200;
    ctx.body = {
      success: 1,
      data: user,
    };
  }

}

module.exports = UserService;
