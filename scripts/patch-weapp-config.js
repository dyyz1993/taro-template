// =====================================================================
// Taro build 后补丁：升级 libVersion 到 3.4.0
//
// Taro 4 默认生成 libVersion 2.32.3，但用了 3.0+ 基础库特性，
// 会导致 "Cannot read property 'F' of undefined" 错误，必须升级。
//
// appid / cloudbaseEnvId 保持 project.config.json 原值不变（由开发者填）。
// 如需通过环境变量覆盖 appid，设置 TARO_APPID 即可。
// =====================================================================
const fs = require('fs');
const path = require('path');

const TARGET_LIB = '3.4.0';
const APPID = process.env.TARO_APPID || ''; // 可选：通过环境变量注入 appid
const TARGETS = [
  path.resolve(__dirname, '..', 'project.config.json'),
  path.resolve(__dirname, '..', 'dist', 'project.config.json')
];

let patchedCount = 0;
for (const cfg of TARGETS) {
  if (!fs.existsSync(cfg)) {
    console.log(`[patch-weapp-config] skip (not found): ${path.relative(process.cwd(), cfg)}`);
    continue;
  }
  try {
    const raw = fs.readFileSync(cfg, 'utf8');
    const json = JSON.parse(raw);
    let changed = false;
    if (json.libVersion !== TARGET_LIB) {
      console.log(`[patch-weapp-config] ${path.relative(process.cwd(), cfg)}: libVersion ${json.libVersion} → ${TARGET_LIB}`);
      json.libVersion = TARGET_LIB;
      changed = true;
    }
    if (APPID && json.appid !== APPID) {
      console.log(`[patch-weapp-config] ${path.relative(process.cwd(), cfg)}: appid → ${APPID}`);
      json.appid = APPID;
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(cfg, JSON.stringify(json, null, 2) + '\n');
      patchedCount++;
    } else {
      console.log(`[patch-weapp-config] ${path.relative(process.cwd(), cfg)}: already up to date`);
    }
  } catch (e) {
    console.error(`[patch-weapp-config] failed on ${cfg}:`, e.message);
  }
}

console.log(`[patch-weapp-config] done, patched ${patchedCount} file(s)`);
