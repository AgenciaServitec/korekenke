import { apis } from "../../firebase";
import useFetch from "use-http";

export const useApi = (pathname, deps = []) => {
  const { apiUrl, token } = apis.korekenke;
  // correct parameters of cache policy
  const options = {
    cachePolicy: "no-cache",
  };

  return useFetch(apiUrl + pathname, options, deps);
};
