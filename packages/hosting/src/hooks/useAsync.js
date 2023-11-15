import { useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";

export const useAsync = (asyncFn, initialParams) => {
  const [loading, setLoading] = useState(initialParams !== undefined);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEmpty(initialParams) && initialParams) {
      void run(...initialParams);
    }
  }, [JSON.stringify(initialParams)]);

  const run = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(undefined);
      setSuccess(false);

      const data = await asyncFn(...args);

      setData(data);
      setSuccess(true);
      return data;
    } catch (e) {
      setError(e);
      console.error(e);
      setSuccess(false);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error, data, success };
};
