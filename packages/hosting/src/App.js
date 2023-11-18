import { Router } from "./router";
import {
  AuthenticationProvider,
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
            <Router />
          </GlobalDataProvider>
        </AuthenticationProvider>
      </ConfigsInitializer>
    </VersionProvider>
  );
};

export default App;
