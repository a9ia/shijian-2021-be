import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.url = {
    frontEnd: 'http://localhost:8080/',
    redirectPage: 'login/callback',
    server: 'https://api.tiaozhan.com/v2/casLogin?redirect_url=',
  };
  return config;
};
