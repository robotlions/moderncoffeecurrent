import "react-native-gesture-handler";
import { useState, useEffect, useCallback, useRef } from "react";
import * as React from "react";
import {
  Text,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { TabNav } from "./Components/NavStack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import vintageCoffee from "./assets/images/vintageCoffee11.jpg";
import carafeBanner from "./assets/images/banners/dripBanner400x300.png";
import appBanner from "./assets/images/banners/appBanner600x400.png";
import { styles } from "./Components/Styles";
import { LoginModal } from "./Components/LoginModal";
import splashImage from "./assets/images/splash.png";
import auth from "@react-native-firebase/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import database from "@react-native-firebase/database";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [networkConnected, setNetworkConnected] = useState(true);
  const [databaseEntryIsPresent, setDatabaseEntryIsPresent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef();


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  function showNetAlert() {
    Alert.alert(
      "modern coffee",
      "This device is offline. We'll save your changes locally then sync your data to your account when you're back online. This can take some time after reconnecting."
    );
  }

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
useEffect(()=>{
  if (user) {
    // if(auth().currentUser.emailVerified===true){
    //   setIsEmailVerified(true)
    // }
    database()
      .ref(`/users/${auth().currentUser.uid}/`)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("updating from app screen")
          setDatabaseEntryIsPresent(true);
        }
      });
  }
},[user])

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
      //  setTimeout(()=>SplashScreen.hideAsync(), 3000);
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!user) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center" }}
        onLayout={onLayoutRootView}
      >
        <Image style={{ height: 400, width: 400 }} source={splashImage}></Image>
        <LoginModal />
      </View>
    );
  }

  if (user && !databaseEntryIsPresent) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center" }}
        onLayout={onLayoutRootView}
      >
        <Image style={{ height: 400, width: 400 }} source={splashImage}></Image>
        <ActivityIndicator />
      </View>
    );
  } 

  // if(user && isEmailVerified===false){
  //   return(
  //     <View
  //       style={{ flex: 1, justifyContent: "center" }}
  //       onLayout={onLayoutRootView}
  //     >
  //       <Image style={{ height: 400, width: 400 }} source={splashImage}></Image>
  //     </View>
  //   )
  // }
  else {
    return (
      <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
        <NavigationContainer>
          {/* <ImageBackground
            resizeMode="cover"
            style={styles.imageBackground}
            source={appBanner}
          >
            <Text style={styles.mainTitleText}>modern coffee</Text>
          </ImageBackground> */}
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
}
