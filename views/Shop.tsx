import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ImageBackground, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { getBundle, getShop } from "../utils/ValorantAPI";
import ShopItem from "../components/ShopItem";
import VPIcon from "../components/VPIcon";
interface props {
  user: user;
}

let imgBackground: {};

export default function Shop(props: PropsWithChildren<props>) {
  const [items, setItems] = useState<singleItem[]>();
  const [bundle, setBundle] = useState<Bundle>();

  useEffect(() => {
    getShop(props.user).then((items) => {
      setItems(items);
    });
    getBundle(props.user).then((bundle) => {
        imgBackground = { uri: bundle.displayIcon};
      setBundle(bundle);
    });
  }, []);

  return (
    <>
      <ScrollView
        style={{
          backgroundColor: "#1a1a1a",
        }}
      >
        <ImageBackground
          style={{
            marginBottom: 10,
            flex: 1,
            justifyContent: "center",
          }}
          source={imgBackground}
          resizeMode="cover"
        >
          <View
            style={{
              padding: 50,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 30,
              }}
            >
              {bundle?.displayName} Bundle
            </Text>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 15,
              }}
            >
              {bundle?.price} <VPIcon color="white" />
            </Text>
          </View>
        </ImageBackground>
        {items?.map((item: singleItem) => (
          <ShopItem item={item} key={item.uuid} />
        ))}
      </ScrollView>
    </>
  );
}
