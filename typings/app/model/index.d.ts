// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComments from '../../../app/model/comments';
import ExportDatas from '../../../app/model/datas';
import ExportMessages from '../../../app/model/messages';
import ExportRecruits from '../../../app/model/recruits';
import ExportTeammates from '../../../app/model/teammates';
import ExportTeams from '../../../app/model/teams';
import ExportUsers from '../../../app/model/users';

declare module 'egg' {
  interface IModel {
    Comments: ReturnType<typeof ExportComments>;
    Datas: ReturnType<typeof ExportDatas>;
    Messages: ReturnType<typeof ExportMessages>;
    Recruits: ReturnType<typeof ExportRecruits>;
    Teammates: ReturnType<typeof ExportTeammates>;
    Teams: ReturnType<typeof ExportTeams>;
    Users: ReturnType<typeof ExportUsers>;
  }
}
