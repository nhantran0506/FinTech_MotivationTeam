import { Alert } from "react-native";
import { useEffect, useState } from "react";

type FetchFunction<T> = () => Promise<T>;

const useRefresh = <T,>(fn: FetchFunction<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      if (Array.isArray(res)) {
        setData(res);
      } else {
        throw new Error("Response is not an array");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("ERROR", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useRefresh;
