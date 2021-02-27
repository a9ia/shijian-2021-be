// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportRole from '../../../app/middleware/role';

declare module 'egg' {
  interface IMiddleware {
    role: typeof ExportRole;
  }
}
