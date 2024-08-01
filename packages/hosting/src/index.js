import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "./styles/fonts/index.css";
import { ScrollTop } from "./ScrollTop";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { GlobalStyle, theme } from "./styles";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(document.getElementById("root"));

const config = {
  components: {
    Button: {
      colorPrimary: theme.colors.primary,
      colorPrimaryHover: theme.colors.secondary,
      colorPrimaryActive: theme.colors.secondary,
    },
    Menu: {
      colorPrimary: theme.colors.primary,
      colorPrimaryHover: theme.colors.secondary,
    },
    Tabs: {
      colorPrimary: theme.colors.primary,
      colorPrimaryHover: theme.colors.secondary,
      colorPrimaryActive: theme.colors.secondary,
    },
    Card: {
      colorFillAlter: theme.colors.secondary,
      colorTextHeading: "white",
    },
    Steps: {
      colorPrimary: theme.colors.primary,
    },
  },
};

root.render(
  <ThemeProvider theme={theme}>
    <ConfigProvider theme={config}>
      <GlobalStyle />
      <BrowserRouter>
        <ScrollTop>
          <App />
        </ScrollTop>
      </BrowserRouter>
    </ConfigProvider>
  </ThemeProvider>,
);
