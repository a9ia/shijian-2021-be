/*
 * @Author: A9ia
 * @Date: 2021-01-26 22:11:27
 * @LastEditTime: 2021-02-09 08:27:12
 */
import { Model, STRING, INTEGER, JSON } from 'sequelize';
import { Application } from 'egg';

class Teams extends Model {
  teamId: string;
  teamName: string;
  projectName: string;
  state: number; // 0为填写完基础信息，1，2为detail和need信息。3/4为审核成功/否，5/6/7为合格/不合格/校级答辩。
  gkdw: number;
  teacher: string;
  targetPlace: {};
  teamDetails: {
    description: string,
    purpose: string,
    background: string,
    units: string
  };
  teamNeed: {
    flag: number,
    clothes: []
  };
}

export default (app: Application) => {
  Teams.init({
    teamId: { type: STRING, primaryKey: true },
    teamName: STRING,
    projectName: STRING,
    state: { type: INTEGER, defaultValue: 0 },
    gkdw: INTEGER,
    teacher: STRING,
    targetPlace: JSON,
    teamDetails: JSON,
    teamNeed: JSON,
  }, {
    modelName: 'teams',
    sequelize: app.model,
    underscored: true,
    timestamps: false,
  });

  return Teams;
};
