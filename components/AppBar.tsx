import React, { PropsWithChildren, useState } from "react";
import { Appbar } from "react-native-paper";
import { Platform } from "react-native";
import { Menu } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

interface props {}
const AppBar = (props: PropsWithChildren<props>) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar style={{ backgroundColor: "#2B2D42" }}>
      <Appbar.Content title="Val-Shop" subtitle={"for Valorant"} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon={MORE_ICON} onPress={openMenu} color="#fff" />
        }
      >
        <Menu.Item
          onPress={() => {
            WebBrowser.openBrowserAsync(
              "https://valorant.fandom.com/wiki/Valorant"
            );
          }}
          title="Add Changelog"
        />
        <Menu.Item
          onPress={() => {
            WebBrowser.openBrowserAsync(
              "https://valorant.fandom.com/wiki/Valorant"
            );
          }}
          title="Add Privacy Policy"
        />
      </Menu>
    </Appbar>
  );
};

export default AppBar;
