/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-24 13:30:05
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-27 15:44:50
 * @FilePath: \catchBirld\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3800,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  worker: {
    format: 'es',
  },
})
