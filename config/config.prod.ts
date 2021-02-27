/*
 * @Author: A9ia
 * @Date: 2021-01-26 15:00:18
 * @LastEditTime: 2021-02-09 08:09:24
 */
import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.url = {
    frontEnd: 'http://shijian.tiaozhan.com/',
    redirectPage: 'login/callback',
    server: 'https://api.tiaozhan.com/v2/casLogin?redirect_url=',
  };

  return config;
};
