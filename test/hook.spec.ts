/*
 * @Author: qiansc
 * @Date: 2019-04-24 15:54:24
 * @Last Modified by: qiansc
 * @Last Modified time: 2019-06-05 17:26:59
 */

import { existsSync, readFileSync, unlinkSync } from 'fs';
import * as gulp from 'gulp';
import * as path from 'path';
import { amdWrap } from '../src/hook';

describe('Hook Test', () => {
  it('minify define', () => {
    const file = `${__dirname}\/dist\/assert\/minify-define.js`;
    if (existsSync(file)) {
      unlinkSync(file);
    }

    return new Promise((resolve) => {
      function require() {
        expect(arguments[0]).toMatchObject([
          'A',
          'assert/B',
          '/C',
          '@D/E',
        ]);
        expect(arguments[1].apply(this, arguments[0])).toBe(5);
        resolve();
      }
      function define(moduleID, deps, func) {
        expect(moduleID).toBe('assert/minify-define');
        expect(deps).toMatchObject([
          'require', '@scope/moduleA', 'assert/moduleB',
        ]);
        func(require, {}, {});
      }

      gulp.src(
          `${__dirname}\/assert/*.js`, {
          base: __dirname,
        },
      //  path.resolve(__dirname, 'assert/minify-define.js')
      ).pipe(amdWrap({
        exclude: ['/assert/exclude-**.js', '/dist/**'],
      })).pipe(
        gulp.dest(`${__dirname}\/dist\/`),
      ).on('end',
        () => {
          const code = readFileSync(file).toString();
          // tslint:disable-next-line:no-eval
          eval(code);
        },
      );

    });
  });
});

// describe('测试评论列表项组件', () => {

//   it('测试1', () => {
//     const propsData = {
//       name: 'hj',
//     };

//     expect(propsData.name).toBe('hj');

//   });

// });
