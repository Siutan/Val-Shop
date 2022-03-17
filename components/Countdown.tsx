import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";

export default function Countdown() {
  const [rTime, rSetTime] = useState<string | undefined>();

  let start = new Date();
  start.setHours(11, 0, 0); // Set refresh time to 11am

  function pad(num: any) {
    return ("0" + parseInt(num)).substr(-2); // format time to 2 digits
  }

  function tick() {
    let now = new Date();
    if (now > start) {
      // too late, go to next day
      start.setDate(start.getDate() + 1);
    }
    let remain = (start.getTime() - now.getTime()) / 1000;
    let hh = pad((remain / 60 / 60) % 60);
    let mm = pad((remain / 60) % 60);
    let ss = pad(remain % 60);
    rSetTime(hh + ":" + mm + ":" + ss);
  }

  useEffect(() => {
    setInterval(function () {
      tick();
    }, 1000);
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20,
          }}
        >
          Shop refresh in: {rTime}
        </Text>
      </View>
    </>
  );
}
