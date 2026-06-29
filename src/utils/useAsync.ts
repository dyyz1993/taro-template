/**
 * useAsync - 统一的异步数据 hook
 * - 自动管理 loading / data / error
 * - deps 变化时自动重跑
 * - 内置防竞态（latestOnly）
 */
import { useEffect, useRef, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const seqRef = useRef(0);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const mySeq = ++seqRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => {
        if (mySeq !== seqRef.current) return;
        setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (mySeq !== seqRef.current) return;
        setState({ data: null, loading: false, error: error instanceof Error ? error : new Error(String(error)) });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadTick]);

  return { ...state, reload: () => setReloadTick((n) => n + 1) };
}
