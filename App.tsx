import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Login from "./views/Login";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import AppBar from "./components/AppBar";
import SnackBar from "./components/SnackBar";
import Navigation from "./components/Navigation";
import Update from "./components/Update";

export default function App() {
  const [loggedIn, setLoggedIn] = useState<user>();
  const [snackbar, setSnackbar] = useState("");

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#dcdcdc",
      accent: "#3c3e57",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <Update />
        <AppBar />
        {!loggedIn ? (
          <Login setLoggedIn={setLoggedIn} setSnackbar={setSnackbar} />
        ) : (
          <Navigation setLoggedIn={setLoggedIn} />
        )}
        <SnackBar
          visible={snackbar != ""}
          value={snackbar}
          setValue={setSnackbar}
        />
        <StatusBar barStyle="default" />
      </SafeAreaView>
    </PaperProvider>
  );
}
