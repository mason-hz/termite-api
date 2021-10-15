/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    sequelize: {
      username: 'root',
      password: 'hoopox1616',
      database: 'termite_db',
      host: '127.0.0.1',
      dialect: 'mysql',
    },
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1616126151021_8096';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    // 4月6号11点（北京时间）
    startTime: 1618542000000,
    // 7月15日11点（北京时间）
    endTime: 1626318000000,
  };

  return {
    ...config,
    ...userConfig,
  };
};
