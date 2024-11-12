import { fetchUser } from "../firebase/collections";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

export const useIsHaveDocuments = (headline) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const _user = await fetchUser(headline?.id);
      setUser(_user);
    })();
  }, [headline]);

  return {
    isHeadlineHaveCip: isEmpty(user?.cipPhoto),
    isHeadlineHaveDni: isEmpty(user?.dniPhoto),
    isHeadlineHaveSignature: isEmpty(user?.signaturePhoto),
  };
};
