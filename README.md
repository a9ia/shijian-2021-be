<!--
 * @Author: A9ia
 * @Date: 2021-01-26 15:00:18
 * @LastEditTime: 2021-02-27 17:28:49
-->
# hackernews-async-ts

[Hacker News](https://news.ycombinator.com/) showcase using typescript && egg

## QuickStart

Firstly, change `database\config.json` and `config\config.default.ts` databases config.
Secondly, run `npx sequelize db:migrate` and `npx sequelize-cli db:seed:all` to migrate database.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js 8.x
- Typescript 2.8+
