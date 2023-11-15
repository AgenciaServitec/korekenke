import { apiUrl } from "../firebase";
import useFetch from "use-http";

export const useApi = (pathname, deps = []) => {
  // correct parameters of cache policy
  const options = {
    cachePolicy: "no-cache",
  };

  return useFetch(apiUrl + pathname, options, deps);
};
