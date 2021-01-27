import { Model, STRING, INTEGER } from 'sequelize'
import { Application } from 'egg'

class Comments extends Model {
  id: number
  title: string
  content: string
  netId: string
  name: string
  read: string
  static associate: () => any
}

export default (app:Application) => {
  Comments.init({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING,
    content: STRING,
    netId: STRING,
    name:STRING,
    read: { type: INTEGER, defaultValue: 0 },
  }, {
    modelName: 'comments',
    sequelize: app.model,
    createdAt: true,
    updatedAt: false,
    underscored: true
  })

  Comments.associate = () => {
    app.model.Comments.belongsTo(app.model.Users,{
      foreignKey:'netId',
      as: 'userInfo'
    })
  }
  return Comments
}