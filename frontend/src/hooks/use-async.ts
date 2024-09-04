import { useCallback, useState } from "react";
import useSafeCallback from "./use-safe-callback";

type Status = "idle" | "pending" | "resolved" | "rejected";

type AsyncState<T> = {
  status: Status;
  data?: T;
  error?: Error;
};

export default function useAsync<T>({ initialData }: { initialData?: T } = {}) {
  const [{ status, data, error }, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: initialData,
    error: undefined,
  });

  const safeSetState = useSafeCallback(setState);

  const setData = useCallback(
    (data: T) => safeSetState({ data, status: "resolved" }),
    [safeSetState]
  );
  const setError = useCallback(
    (error: Error) => safeSetState({ error, status: "rejected" }),
    [safeSetState]
  );

  const reset = useCallback(
    () =>
      safeSetState({
        status: "idle",
        data: initialData,
        error: undefined,
      }),
    [initialData, safeSetState]
  );

  const run = (promise: Promise<T>) => {
    if (!promise || !promise.then) {
      throw new Error(
        `The argument passed to useAsync().run must be a promise`
      );
    }

    safeSetState({ status: "pending" });

    return promise.then(
      (data) => {
        setData(data);
        return data;
      },
      (error) => {
        setError(error);
        return Promise.reject(error);
      }
    );
  };

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}
