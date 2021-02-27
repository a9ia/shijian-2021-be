/*
 * @Author: A9ia
 * @Date: 2021-01-27 15:01:10
 * @LastEditTime: 2021-02-09 12:07:00
 */
import { Model, STRING, INTEGER, TINYINT } from 'sequelize';
import { Application } from 'egg';

class Messages extends Model {
  id: number;
  content: string;
  netId: string;
  target: string;
  hasread:number;
}

export default (app:Application) => {
  Messages.init({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    content: STRING,
    netId: STRING,
    target: STRING,
    hasread: { type: TINYINT, defaultValue: 0 },
  }, {
    modelName: 'messages',
    sequelize: app.model,
    createdAt: true,
    updatedAt: false,
  });
  return Messages;
};
