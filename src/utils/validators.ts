/**
 * 表单校验工具
 * - 用于失物招领、生成码、联系信息等场景
 */

export type Validator = (v: string) => string | null;

/** 必填 */
export const required: Validator = (v) => (v && v.trim() ? null : '此项不能为空');

/** 最小长度 */
export const minLen = (n: number): Validator => (v) =>
  v && v.length >= n ? null : `至少 ${n} 个字符`;

/** 最大长度 */
export const maxLen = (n: number): Validator => (v) =>
  !v || v.length <= n ? null : `最多 ${n} 个字符`;

/** 中国大陆手机号 */
export const phone: Validator = (v) => {
  if (!v) return null;
  return /^1[3-9]\d{9}$/.test(v) ? null : '手机号格式不正确';
};

/** 邮箱 */
export const email: Validator = (v) => {
  if (!v) return null;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)
    ? null
    : '邮箱格式不正确';
};

/** 微信 id（6+ 字符，字母数字下划线） */
export const wechat: Validator = (v) => {
  if (!v) return null;
  return /^[A-Za-z0-9_]{6,}$/.test(v) ? null : '微信号至少 6 位（字母/数字/下划线）';
};

/** 组合校验：返回第一个错误 */
export const compose = (...vs: Validator[]) => (v: string) => {
  for (const fn of vs) {
    const err = fn(v);
    if (err) return err;
  }
  return null;
};

/** 校验整个 form，返回每字段错误；空对象表示通过 */
export function validateForm<T extends Record<string, string>>(
  form: T,
  rules: Partial<Record<keyof T, Validator>>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  (Object.keys(rules) as (keyof T)[]).forEach((k) => {
    const fn = rules[k];
    if (!fn) return;
    const err = fn(form[k] || '');
    if (err) errors[k] = err;
  });
  return errors;
}
