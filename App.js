import "react-native-gesture-handler";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { TabNav } from "./Components/NavStack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { styles } from "./Components/Styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import { initialize } from 'react-native-clarity';
import { initializeLocalData } from "./Data/Storage";



SplashScreen.preventAutoHideAsync();


initialize("l95ggsqlol");

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  function showNetAlert() {
    Alert.alert(
      "modern coffee",
      "This device is offline. Your recipes are stored on this device, so you can keep using the app."
    );
  }

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Raleway-Bold": {
            uri: require("./assets/fonts/Raleway-Bold.ttf"),
          },
          "Raleway-Medium": {
            uri: require("./assets/fonts/Raleway-Medium.ttf"),
          },
          "Raleway-Black": {
            uri: require("./assets/fonts/Raleway-Black.ttf"),
          },

          "Corben-Bold": {
            uri: require("./assets/fonts/Corben-Bold.ttf"),
          },
          "Corben-Regular": {
            uri: require("./assets/fonts/Corben-Regular.ttf"),
          },
        });
        await initializeLocalData();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <NavigationContainer>
        {networkConnected === false && (
          <TouchableOpacity
            style={styles.netWarningWindow}
            onPress={() => showNetAlert()}
          >
            <Text style={styles.netWarningText}>
              No network connection. Tap for information.
            </Text>
          </TouchableOpacity>
        )}
        <TabNav />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
