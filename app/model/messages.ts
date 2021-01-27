import { Model, STRING,INTEGER,TINYINT } from 'sequelize'
import { Application } from 'egg'

class Messages extends Model {
  id: number
  content: string
  netId: string
  hasread:number
}

export default (app:Application) => {
  Messages.init({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    content: STRING,
    netId: STRING,
    hasread: { type:TINYINT, defaultValue: 0 }
  }, {
    modelName: 'messages',
    sequelize: app.model,
    timestamps: true,
    updatedAt: false,
  })
  return Messages
}