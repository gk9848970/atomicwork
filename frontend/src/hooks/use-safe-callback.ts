import { useCallback, useLayoutEffect, useRef } from "react";

export default function useSafeCallback<TArgs>(
  callback: (...args: TArgs[]) => void
) {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(
    (...args: TArgs[]) => (mounted.current ? callback(...args) : undefined),
    [callback]
  );
}
