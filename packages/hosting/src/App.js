import React from "react";
import { Router } from "./router";
import {
  AuthenticationProvider,
  CommandProvider,
  ConfigsInitializer,
  GlobalDataProvider,
  VersionProvider,
} from "./providers";

const App = () => {
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
