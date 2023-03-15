import 'react-native-gesture-handler';
import {useState, useEffect, useCallback} from 'react';
import * as React from 'react';
import { Text, ImageBackground, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TabNav } from './Components/NavStack';
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import vintageCoffee from './assets/images/vintageCoffee11.jpg'
import { styles } from './Components/Styles';
import { LoginModal } from './Components/LoginModal';
import splashImage from './assets/images/splash.png';
import auth from '@react-native-firebase/auth';
import {GestureHandlerRootView} from 'react-native-gesture-handler';



export default function App() {


  const [appIsReady, setAppIsReady] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }


  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // const app = initializeApp(firebaseConfig);

        // const auth = initializeAuth(app, {
        //   persistence: getReactNativePersistence(AsyncStorage)
        // });
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
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        // setUser(getAuth().currentUser);
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        
    return subscriber;
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  

 if(!user){
  return(
    <View style={{flex: 1,justifyContent: "center"}}>
      <Image style={{height:400,width:400}}source={splashImage}></Image>
      <LoginModal/>
      </View>
  )
 }
 else{

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
    <NavigationContainer>
      <ImageBackground resizeMode="cover" style={{ maxHeight:"30%" }} source={vintageCoffee}>
        <Text style={styles.mainTitleText}>modern coffee</Text>
      </ImageBackground>
      {/* <NavStack /> */}
      <TabNav />
    </NavigationContainer>
    </GestureHandlerRootView>
 )
    }
  }











