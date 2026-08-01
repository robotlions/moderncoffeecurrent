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
  import { useFocusEffect } from "@react-navigation/native";
  import featuredRecipesBanner from "../assets/images/banners/featuredRecipesBanner600x400.png";
  import { getAllRecipes } from "../Data/Storage";
  
  
  export function FeaturedRecipes({ route, navigation }) {
    const [loadedData, setLoadedData] = useState([]);
    const [screenLoaded, setScreenLoaded] = useState(false);
  
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
        const allRecipes = await getAllRecipes();
        let favArray = [];
        Object.values(allRecipes).forEach((item) => {
          favArray.push(item);
        });
        setLoadedData(favArray);
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
      <ScrollView>
      <ImageBackground
              resizeMode="cover"
              style={styles.imageBackground}
              source={featuredRecipesBanner}
            >
              <Text style={styles.methodBannerText}>Featured Recipes</Text>
            </ImageBackground>
            {displayData}</ScrollView></>
      );
    }
  }
  
