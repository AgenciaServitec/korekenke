import React, { useEffect } from "react";
import { Router } from "./router";
import {
  AuthenticationProvider,
  CommandProvider,
  ConfigsInitializer,
  GlobalDataProvider,
  useAuthentication,
  VersionProvider,
} from "./providers";
import { deleteSessionVerification } from "./firebase/collections";

const App = () => {
  const { authUser } = useAuthentication();

  useEffect(() => {
    (async () => {
      if (authUser) {
        await deleteSessionVerification(authUser.id);
      }
    })();
  }, []);

  return (
    <VersionProvider>
      <ConfigsInitializer>
        <AuthenticationProvider>
          <CommandProvider>
            <GlobalDataProvider>
              <Router />
            </GlobalDataProvider>
          </CommandProvider>
        </AuthenticationProvider>
      </ConfigsInitializer>
    </VersionProvider>
  );
};

export default App;
