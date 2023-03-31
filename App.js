import "react-native-gesture-handler";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { Text, ImageBackground, View, Image, TouchableOpacity, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { TabNav } from "./Components/NavStack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import vintageCoffee from "./assets/images/vintageCoffee11.jpg";
import { styles } from "./Components/Styles";
import { LoginModal } from "./Components/LoginModal";
import splashImage from "./assets/images/splash.png";
import auth from "@react-native-firebase/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from '@react-native-community/netinfo';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [networkConnected, setNetworkConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  function showNetAlert(){
Alert.alert("modern coffee","This device is offline. We'll save your changes locally then sync your data to your account when you're back online. This can take some time after reconnecting.")
  }


//   useEffect(()=>{
//   const unsubscribe = NetInfo.addEventListener(state => {
//     console.log("Connection type", state.type);
//     console.log("Is connected?", state.isConnected);

//   })
// return unsubscribe;
// },[]);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
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

        await new Promise((resolve) => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        return subscriber;
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

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}
      onLayout={onLayoutRootView}
      >
        <Image style={{ height: 400, width: 400 }} source={splashImage}></Image>
        <LoginModal />
      </View>
    );
  } else {
    return (
      <GestureHandlerRootView 
      onLayout={onLayoutRootView}
      style={{ flex: 1 }}>
        <NavigationContainer>
          <ImageBackground
            resizeMode="cover"
            style={ styles.imageBackground}
            source={vintageCoffee}
          >
            <Text style={styles.mainTitleText}>modern coffee</Text>
          </ImageBackground>
          {networkConnected===false && <TouchableOpacity style={styles.netWarningWindow} onPress={()=>showNetAlert()}><Text style={styles.netWarningText}>No network connection. Tap for information.</Text></TouchableOpacity>}
          <TabNav />
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }
}
