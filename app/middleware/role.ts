import { Context } from 'egg'

export default (least: number) => async (ctx: Context, next: () => Promise<any>) => {
  if (await ctx.getRole() >= least) {
    await next()
  } else {
    ctx.error('权限不足')
  }
}
