import { useState, useCallback } from "react";
import api from "../services/api";

export function useApi(initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, payload = null, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api[method](url, payload, config);
      setData(res.data);
      return res.data;
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Something went wrong";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config) => request("get", url, null, config), [request]);
  const post = useCallback((url, data, config) => request("post", url, data, config), [request]);
  const put = useCallback((url, data, config) => request("put", url, data, config), [request]);
  const del = useCallback((url, config) => request("delete", url, null, config), [request]);

  const reset = () => { setData(initialData); setError(null); };

  return { data, loading, error, get, post, put, del, reset, setData };
}