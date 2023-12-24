import {
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  View,
  ImageBackground,
} from "react-native";
import { useCallback, useState } from "react";
import { styles } from "./Styles";
import favoriteIcon from "../assets/images/favoriteIcon.png";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import appBanner from "../assets/images/banners/appBanner600x400.png";


export function Favorites({ route, navigation }) {
  const [loadedData, setLoadedData] = useState([]);
  const [screenLoaded, setScreenLoaded] = useState(false);

  const user = auth().currentUser;

  function selectRecipe(item, key, value) {
    navigation.navigate("Display Recipe", {
      loadedMethod: value.method,
      loadedID: key,
      loadedRecipe: value,
    });
  }

  useFocusEffect(
    useCallback(() => {
      let loading = true;
      if (loading === true) {
        fetchAndLoadData();
        loading = false;
      }
    }, [])
  );

  async function fetchAndLoadData() {
    try {
      await database()
        .ref(`/users/${user.uid}/recipes/`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            let favArray = [];
            snapshot.forEach((item) => {
              favArray.push(item.val());
            });
            setLoadedData(favArray);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  function doRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const displayData = Object.values(loadedData).map((item, index) =>
    Object.entries(item)
      .filter(([key, value]) => value.favorite == true)
      .map(([key, value]) => (
        <TouchableOpacity
          style={[styles.entry, { backgroundColor: value.backgroundColor }]}
          key={index + doRandom(1, 1000)}
          onPress={() => selectRecipe(item, key, value)}
        >
          <Text style={styles.entryHeadline}>
            {value["Recipe Name"].variableValue}
          </Text>
          <Text style={styles.entryMethod}>{value.method}</Text>
          <Text style={styles.entryDesc}>
            {value["Description"].variableValue}
          </Text>
          {value.favorite == true ? (
            <Image source={favoriteIcon} style={styles.favorite} />
          ) : (
            <Text> </Text>
          )}
        </TouchableOpacity>
      ))
  );

  if (screenLoaded === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  } else {
    return(<>
    <ImageBackground
            resizeMode="cover"
            style={styles.imageBackground}
            source={appBanner}
          >
            <Text style={styles.mainTitleText}>modern coffee</Text>
          </ImageBackground>
          <ScrollView>{displayData}</ScrollView></>
    );
  }
}
