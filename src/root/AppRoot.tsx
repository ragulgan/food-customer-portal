import * as React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import Header from "../modules/commonToast/header/header";
import Footer from "../modules/commonToast/footer/footer";

const mdTheme = createTheme();

const AppRoot: React.FC<any> = () => {

  return (
    <React.Fragment>
      <ThemeProvider theme={mdTheme}>
        <Header />
        <Outlet />
        <Footer/>
      </ThemeProvider>
    </React.Fragment>
  );
};
export default AppRoot;