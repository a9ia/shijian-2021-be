import { Model, STRING, INTEGER } from 'sequelize'
import { Application } from 'egg'

class Users extends Model {
    netId: string
    name: string
    role: number  // default: 0, administrator: 1, super: 2
    phone: string
    college: string
    grade: string
    class: string
}

export default (app: Application) => {
    Users.init ({
        netId: { type: STRING, primaryKey:true },
        name: STRING(30),
        phone: STRING(11),
        role: { type: INTEGER, defaultValue: 0 },
        college: STRING,
        grade: STRING,
        class: STRING
    
    }, {
        modelName: 'users',
        sequelize: app.model,
        underscored: true
    })

    return Users
}