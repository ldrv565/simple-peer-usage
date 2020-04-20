import { useCallback, useEffect, useState } from 'react';

const INITIAL_STATE = {
  data: null,
  error: null,
  fetching: false,
  success: false
};

const useFetch = ({ source, initialParams, lazy = false }) => {
  const [status, setStatus] = useState(INITIAL_STATE);

  const request = useCallback(async params => {
    setStatus({ ...status, fetching: true });
    try {
      const result = await source(params);

      setStatus({
        ...status,
        data: result,
        fetching: false,
        success: true
      });

      return result.data;
    } catch (e) {
      setStatus({
        ...status,
        data: null,
        fetching: false,
        success: false,
        error: e.message
      });
    }
  }, []);

  useEffect(() => {
    if (!lazy) request(initialParams);
  }, [request, initialParams]);

  return [status, request];
};

export default useFetch;
