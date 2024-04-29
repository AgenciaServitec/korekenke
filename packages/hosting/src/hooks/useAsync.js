import { useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { currentEnvironment } from "../config";

export const useAsync = (asyncFn, initialParams = undefined) => {
  const [loading, setLoading] = useState(initialParams !== undefined);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEmpty(initialParams) && initialParams) {
      void start(initialParams);
    }
  }, [JSON.stringify(initialParams)]);

  const start = async (initialParams) => {
    try {
      await run(...initialParams);
    } catch (e) {
      currentEnvironment === "development" && console.error(e);
    }
  };

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
