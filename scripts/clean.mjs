/**
 * @description 清理渲染产物和桌面应用打包目录。
 */

import { rm } from 'node:fs/promises';

/**
 * @description 删除常见构建目录，方便重新构建。
 * @returns {Promise<void>}
 */
async function cleanBuildArtifacts() {
  await Promise.all([
    rm(new URL('../dist', import.meta.url), { recursive: true, force: true }),
    rm(new URL('../release', import.meta.url), { recursive: true, force: true }),
  ]);
}

await cleanBuildArtifacts();
