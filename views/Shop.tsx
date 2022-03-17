import React from "react";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { getShop, sRegion } from "../utils/ValorantAPI";
import ShopItem from "../components/ShopItem";
import Countdown from "../components/Countdown";
import VPIcon from "../components/VPIcon";

let imgBackground: {};

export default function Shop() {
  const [items, setItems] = useState<singleItem[]>([]);
  const [bundle, setBundle] = useState<Bundle>();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getShop(sRegion).then((res) => {
      console.log("refreshing");
      setItems(res.shop);
      imgBackground = { uri: res.bundle.displayIcon };
      setBundle(res.bundle);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    getShop(sRegion).then((res) => {
      setItems(res.shop);
      imgBackground = { uri: res.bundle.displayIcon };
      setBundle(res.bundle);
    });
  }, []);

  const wait = (timeout: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);



  if (items?.length == 0 || !bundle) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={true} color={"#fa4454"} size="large" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getData} />
          }
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
          <Countdown />
          {items?.map((item: singleItem) => (
            <ShopItem item={item} key={item.uuid} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
