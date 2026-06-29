/** 生成唯一码（主码/子码） */
export function genCode(prefix: string = 'D'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}${ts}${rand}`;
}

/** 格式化时间 */
export function formatTime(iso?: string, fmt: string = 'YYYY-MM-DD HH:mm'): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return fmt
    .replace('YYYY', String(d.getFullYear()))
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
}

/** 相对时间：今天 10:23 / 昨天 21:16 / 05-20 18:42 */
export function relativeTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `今天 ${formatTime(iso, 'HH:mm')}`;
  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return `昨天 ${formatTime(iso, 'HH:mm')}`;
  return formatTime(iso, 'MM-DD HH:mm');
}

/** 脱敏手机号：138****5678 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

/** 脱敏邮箱：wan****@example.com */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [u, d] = email.split('@');
  if (u.length <= 2) return `${u}****@${d}`;
  return `${u.slice(0, 3)}****@${d}`;
}
