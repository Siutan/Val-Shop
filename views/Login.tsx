import React, { PropsWithChildren, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  TextInput,
  Checkbox,
  ActivityIndicator,
  Text,
  Dialog,
  List,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { login, setSRegion, submitMfaCode } from "../utils/ValorantAPI";
import * as SecureStore from "expo-secure-store";

interface props {
  setLoggedIn: Function;
  setSnackbar: Function;
}
export default function Login(props: PropsWithChildren<props>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("eu");
  const [loading, setLoading] = useState(false);
  const [savePw, setSavePw] = useState(true);
  const [dropdownShown, setDropdownShown] = useState(false);
  const [MFAInputEnabled, setMFAInputEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");

  const handleBtnLogin = async () => {
    setLoading(true);
    let response = await login(username, password);

    if (response?.error) {
      setLoading(false);
      props.setSnackbar(response.error);
    } else if (response?.mfaRequired) {
      setLoading(false);
      setMFAInputEnabled(true);
      props.setSnackbar(
        `The MFA code has been sent to your email (${response.mfaEmail}).`
      );
    } else {
      if (savePw) {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({
            username,
            password,
            region,
            accessToken: response?.accessToken,
            entitlementsToken: response?.entitlementsToken,
          })
        );
      } else {
        await SecureStore.deleteItemAsync("user");
      }
      setSRegion(region);
      props.setLoggedIn(true);
    }
  };

  const handleMfaCode = async () => {
    setLoading(true);
    let response = await submitMfaCode(mfaCode);

    if (response.error) {
      setLoading(false);
      props.setSnackbar(response.error);
    } else {
      if (savePw) {
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify({
            username,
            password,
            region,
            accessToken: response.accessToken,
            entitlementsToken: response.entitlementsToken,
          })
        );
      } else {
        await SecureStore.deleteItemAsync("user");
      }
      setSRegion(region);
      props.setLoggedIn(true);
    }
  };

  const handleDirectLogin = async ({
    username,
    password,
    accessToken,
    entitlementsToken,
  }: any) => {
    let response = await login(
      username,
      password,
      accessToken,
      entitlementsToken
    );
    if (response?.error) {
      setLoading(false);
      props.setSnackbar(response.error);
    } else if (response?.mfaRequired) {
      setLoading(false);
      setMFAInputEnabled(true);
      props.setSnackbar(
        `The MFA code has been sent to your email (${response.mfaEmail}).`
      );
    } else {
      props.setLoggedIn(true);
    }
  };

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  useEffect(() => {
    setLoading(true);
    const restoreCredentials = async () => {
      let user = await SecureStore.getItemAsync("user");
      let userObj = user ? JSON.parse(user) : null;
      if (userObj) {
        setUsername(userObj.username); // Required because if 2fa is required, the username is accessed in handleMfaCode function
        setPassword(userObj.password);
        setRegion(userObj.region);

        await handleDirectLogin(userObj);
      } else {
        setLoading(false);
      }
    };
    restoreCredentials();
  }, []);

  if (loading)
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

  if (MFAInputEnabled) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{ width: 250, height: 50, marginBottom: 10 }}
          onChangeText={(text) => {
            setMfaCode(text);
          }}
          value={mfaCode}
          label="MFA Code"
          autoCompleteType="password"
        />
        <Button onPress={handleMfaCode} mode="contained">
          Submit
        </Button>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#161a1d",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>
        <TextInput
          style={{
            backgroundColor: "#EDF2F4",
            width: 250,
            height: 50,
            marginBottom: 10,
          }}
          onChangeText={(text) => {
            setUsername(text);
          }}
          value={username}
          label="Username"
          autoCompleteType="username"
        />
        <TextInput
          label="Password"
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
          style={{
            backgroundColor: "#EDF2F4",
            width: 250,
            height: 50,
            marginBottom: 10,
          }}
          autoCompleteType="password"
          secureTextEntry={true}
        />
        <Checkbox.Item
          uncheckedColor="white"
          color="#fa4454"
          label="Save credentials"
          labelStyle={{ color: "#fa4454" }}
          status={savePw ? "checked" : "unchecked"}
          onPress={() => {
            setSavePw(!savePw);
          }}
        />
        <View style={{ width: 100, marginBottom: 15 }}>
          <DropDown
            label={"Region"}
            mode={"outlined"}
            visible={dropdownShown}
            showDropDown={() => setDropdownShown(true)}
            onDismiss={() => setDropdownShown(false)}
            value={region}
            setValue={setRegion}
            list={[
              { label: "EU", value: "eu" },
              { label: "NA", value: "na" },
              { label: "AP", value: "ap" },
              { label: "KR", value: "kr" },
            ]}
          />
        </View>
        <Button onPress={handleBtnLogin} disabled={loading}>
          Log In
        </Button>
        <Text
          style={{
            color: "#fa4454",
            fontSize: 18,
            marginTop: 20,
            textAlign: "center",

            padding: 10,
          }}
          onPress={() => {
            showDialog();
          }}
        >
          Don't know which server to pick? Tap HERE to find out!
          {`\n \n`}
          If you pick the wrong server, you will see the wrong shop!
        </Text>
        <Dialog
          style={{
            height: 625,
          }}
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Title>Valorant Servers</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <Dialog.Content>
                <List.Section title={"Tap below to see which server you're in"}>
                  <List.Accordion
                    titleStyle={{
                      color: "#161a1d",
                    }}
                    title="NA"
                    left={(props) => <List.Icon {...props} icon="dns" />}
                  >
                    <List.Item title="US West (Oregon 1)" />
                    <List.Item title="US West (Oregon 2)" />
                    <List.Item title="US West (N. California 1)" />
                    <List.Item title="US West (N. California 2)" />
                    <List.Item title="US East (N. Virginia 1)" />
                    <List.Item title="US East (N. Virginia 2)" />
                    <List.Item title="US Central (Texas)" />
                    <List.Item title="US Central (Illinois)" />
                    <List.Item title="US Central (Georgia)" />
                  </List.Accordion>

                  <List.Accordion
                    titleStyle={{
                      color: "#161a1d",
                    }}
                    title="LATAM"
                    left={(props) => <List.Icon {...props} icon="dns" />}
                    onPress={handlePress}
                  >
                    <List.Item title="Santiago" />
                    <List.Item title="Mexico City" />
                    <List.Item title="Miami" />
                  </List.Accordion>

                  <List.Accordion
                    titleStyle={{
                      color: "#161a1d",
                    }}
                    title="BR"
                    left={(props) => <List.Icon {...props} icon="dns" />}
                    onPress={handlePress}
                  >
                    <List.Item title="Sao Paulo 1" />
                    <List.Item title="Sau Paulo 2" />
                  </List.Accordion>

                  <List.Accordion
                    titleStyle={{
                      color: "#161a1d",
                    }}
                    title="EU"
                    left={(props) => <List.Icon {...props} icon="dns" />}
                    onPress={handlePress}
                  >
                    <List.Item title="Frankfurt 1" />
                    <List.Item title="Frankfurt 2" />
                    <List.Item title="Paris 1" />
                    <List.Item title="Paris 2" />
                    <List.Item title="Stockholm 1" />
                    <List.Item title="Stockholm 2" />
                    <List.Item title="Istanbul" />
                    <List.Item title="London" />
                    <List.Item title="Tokyo" />
                    <List.Item title="Warsaw" />
                    <List.Item title="Madrid" />
                    <List.Item title="Bahrain" />
                  </List.Accordion>

                  <List.Accordion
                    titleStyle={{
                      color: "#161a1d",
                    }}
                    title="KR"
                    left={(props) => <List.Icon {...props} icon="dns" />}
                    onPress={handlePress}
                  >
                    <List.Item title="Seoul 1" />
                    <List.Item title="Seoul 2" />
                  </List.Accordion>

                  <List.Accordion
                    titleStyle={{
                      color: "#161a1d",
                    }}
                    title="AP"
                    left={(props) => <List.Icon {...props} icon="dns" />}
                    onPress={handlePress}
                  >
                    <List.Item title="Hong Kong 1" />
                    <List.Item title="Hong Kong 2" />
                    <List.Item title="Tokyo 1" />
                    <List.Item title="Tokyo 2" />
                    <List.Item title="Singapore 1" />
                    <List.Item title="Singapore 2" />
                    <List.Item title="Sydney 1" />
                    <List.Item title="Sydney 2" />
                    <List.Item title="Mumbai" />
                  </List.Accordion>
                </List.Section>
              </Dialog.Content>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button style={{ backgroundColor: "#fa4454" }} onPress={hideDialog}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </>
    </View>
  );
}
