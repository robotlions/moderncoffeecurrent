import { Text, TouchableOpacity, ScrollView, View, ActivityIndicator, Image, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";
import { useState, useEffect, useCallback } from "react";
import { methodObjects } from "../Data/Models";
import favoriteIcon from "../assets/images/icons/favoritesStarIconWhite200x200.png";
import appBanner from "../assets/images/banners/appBanner600x400.png";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import featuredIcon from "../assets/images/icons/featuredIconWhite200x200.png"
import {PermissionsAndroid} from 'react-native';
import { getMethods } from "../Data/Storage";
 

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


export function HomeScreen({ route, navigation }) {
  const [methodList, setMethodList] = useState(methodObjects);
  const [listLoaded, setListLoaded] = useState(false);
  const [storageChecked, setStorageChecked] = useState(false);
  const [featuredVisible, setFeaturedVisible] = useState(true);

    useFocusEffect(
      useCallback(() => {
        getMethods().then((methods) => {
          setMethodList(methods);
          setListLoaded(true);
        });
        checkLocalStorageForFeatured();
        setStorageChecked(true);
      }, [])
    );

       async function checkLocalStorageForFeatured(){
        try{
          await AsyncStorage.getItem("modern_coffee_featured").then((value)=>{
            if(value==="true"){
              setFeaturedVisible(true)
            }
            if(value==="false"){
              setFeaturedVisible(false)
            }
          })
        }
        catch (e){
          console.log(e)
        }
       }

  const favoritesDisplay = (
    <TouchableOpacity
      style={[styles.categoryTouchable, { backgroundColor: "#FD7908" }]}
      onPress={() => navigation.navigate("Favorites")}
    >
      <Text style={styles.categoryText}>Favorites</Text>
      {/* <Image style={styles.methodIcon} source={favoriteIcon} /> */}

    </TouchableOpacity>
  );

  const featuredRecipesDisplay = (
    <TouchableOpacity
      style={[styles.categoryTouchable, {     backgroundColor: "#9f3201"}]}
      onPress={() => navigation.navigate("Featured Recipes")}
    >
      <Text style={styles.categoryText}>Featured Recipes</Text>
      {/* <Image style={styles.methodIcon} source={featuredIcon} /> */}

    </TouchableOpacity>
  );


  const MethodDisplay = () => {
    if(listLoaded===false){
      return<ActivityIndicator/>
    }
    else{
    return(
    methodList!=null && Object.values(methodList)
    .sort((a, b) => a.order - b.order)
    .filter((item) => item.visible === true)
    .map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.categoryTouchable,
          { backgroundColor: item.backgroundColor },
        ]}
        onPress={() =>
          navigation.navigate("List Recipes", {
            filter: String(item.methodName),
            bannerUrl: item.bannerUrl,
          })
        }
      >
        <Text style={styles.categoryText}>{item.methodName}</Text>
        <Image style={styles.methodIcon} source={item.iconUrl} />
      </TouchableOpacity>
    )))};
      }

  return (
      
      <ScrollView style={{backgroundColor: "white"}}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      
      <ImageBackground
            resizeMode="cover"
            style={styles.imageBackgroundHome}
            source={appBanner}
          >
            <Text style={styles.mainTitleText}>modern coffee</Text>
          </ImageBackground>
      
      <View style={{flexDirection: "row", flexWrap:"wrap", justifyContent:"space-around", paddingLeft: 20, paddingRight: 20, paddingBottom: 30}}>
        
        {favoritesDisplay}
        {featuredVisible && featuredRecipesDisplay}
        <MethodDisplay />
        <TouchableOpacity
          style={[
            styles.addItemTouchable,
            {
              borderRadius: 8,
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            },
          ]}
          onPress={() => navigation.navigate("Create Recipe")}
        >
          <Text style={[styles.categoryText, {color: "white" }]}>
            Create Recipe
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
  );
}
