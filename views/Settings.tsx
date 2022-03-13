import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { clearCookies, resetCache } from "../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

interface props {
  user: user;
  setUser: Function;
}
export default function Settings(props: PropsWithChildren<props>) {
  const handleLogout = () => {
    SecureStore.deleteItemAsync("user").then(() => {
      clearCookies();
      resetCache();
      props.setUser(null);
    });
  };

  return (
    <View
      style={{
        backgroundColor: "#1e1e1e",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 15 }}>
        Logged in as{" "}
        <Text style={{ textTransform: 'uppercase', color: "white", fontWeight: "bold" }}>{props.user.name}</Text>
      </Text>
      <Text style={{ color: "white", fontSize: 15 }}>
        Region: <Text style={{ textTransform: 'uppercase', color: "white", fontWeight: "bold" }}>{props.user.region}</Text>
      </Text>
      <Button style={{ marginTop: 10 }} onPress={handleLogout} mode="contained">
        Log Out
      </Button>
    </View>
  );
}
