import React from "react";
import { Router } from "./router";
import {
  AuthenticationProvider,
  ChangeDefaultRoleProvider,
  ConfigsInitializer,
  GlobalDataProvider,
  VersionProvider,
} from "./providers";

const App = () => {
  return (
    <VersionProvider>
      <ConfigsInitializer>
        <AuthenticationProvider>
          <GlobalDataProvider>
            <ChangeDefaultRoleProvider>
              <Router />
            </ChangeDefaultRoleProvider>
          </GlobalDataProvider>
        </AuthenticationProvider>
      </ConfigsInitializer>
    </VersionProvider>
  );
};

export default App;
