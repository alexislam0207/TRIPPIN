import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import MainContainer from "./navigation/MainContainer";
import { StyleSheet, View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import CustomMapView from "./components/CustomMapView";

import { userCheck } from "./utils/backendView";
import BackendTest from "./utils/testComponents/BackendTest";

export default function App() {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const userSet = async () => {
      const userChecker = await userCheck("bool");
      if (!userChecker) {
        setUser(null);
      } else {
        const userdata = await userCheck();
        setUser(userdata);
      }
    };
    userSet();
    setUserLoggedIn(false);
  }, [userLoggedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.AndroidSafeArea}>
        <PaperProvider>
          <MainContainer user={user} setUser={setUser} setUserLoggedIn={setUserLoggedIn} />
        </PaperProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
    // // <View style={styles.page}>
    // //   <CustomMapView />
    // // </View>
    // <BackendTest />
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
