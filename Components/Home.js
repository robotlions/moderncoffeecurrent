import { Text, TouchableOpacity, ScrollView, View, ActivityIndicator, Image, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";
import { useState, useEffect, useCallback } from "react";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { methodObjects } from "../Data/Models";
import favoriteIcon from "../assets/images/icons/favoritesStarIconWhite200x200.png";
import appBanner from "../assets/images/banners/appBanner600x400.png";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import featuredIcon from "../assets/images/icons/featuredIconWhite200x200.png"
import {PermissionsAndroid} from 'react-native';
 

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


export function HomeScreen({ route, navigation }) {
  const [methodList, setMethodList] = useState(methodObjects);
  const [listLoaded, setListLoaded] = useState(false);
  const [storageChecked, setStorageChecked] = useState(false);
  const [featuredVisible, setFeaturedVisible] = useState(true);

  const user = auth().currentUser;

    useEffect(()=>{
        if(user){
        database()
          .ref(`/users/${auth().currentUser.uid}/methods/`)
          .on("value", (snapshot) => {
             console.log("updating from home screen")
                setMethodList(snapshot.val());
                setListLoaded(true);
              })
        }
      return () =>{setListLoaded(false),setMethodList(methodObjects),console.log("list unloaded")}
      },[user])


  
       useFocusEffect(
        useCallback(()=>{
            checkLocalStorageForFeatured();
            setStorageChecked(true);
          
        })
       )

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
      
      <ScrollView>
      <StatusBar translucent={true} backgroundColor="transparent" />
      
      <View style={{flexDirection: "row", flexWrap:"wrap", justifyContent:"space-around"}}>
      
      <ImageBackground
            resizeMode="cover"
            style={styles.imageBackgroundHome}
            source={appBanner}
          >
            <Text style={styles.mainTitleText}>modern coffee</Text>
          </ImageBackground>
        
        {favoritesDisplay}
        {featuredVisible && featuredRecipesDisplay}
        <MethodDisplay />
        <TouchableOpacity
          style={styles.addItemTouchable}
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
