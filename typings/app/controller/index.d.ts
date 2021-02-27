// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportComment from '../../../app/controller/comment';
import ExportRecruit from '../../../app/controller/recruit';
import ExportTeam from '../../../app/controller/team';
import ExportTeammate from '../../../app/controller/teammate';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    comment: ExportComment;
    recruit: ExportRecruit;
    team: ExportTeam;
    teammate: ExportTeammate;
    user: ExportUser;
  }
}
