/*
 * @Author: A9ia
 * @Date: 2021-02-03 14:19:28
 * @LastEditTime: 2021-02-09 08:27:30
 */
import { Model, STRING, INTEGER } from 'sequelize';
import { Application } from 'egg';

class Datas extends Model {
  id: number;
  key: string;
  value: number;
}

export default (app:Application) => {
  Datas.init({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    key: STRING,
    value: INTEGER,
  }, {
    modelName: 'datas',
    sequelize: app.model,
    timestamps: false,
    underscored: true,
  });

  return Datas;
};
