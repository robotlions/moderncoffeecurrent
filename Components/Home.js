import { Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";
import { useState, useEffect } from "react";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { methodObjects } from "../Data/Models";
import favoriteIcon from "../assets/images/icons/favoriteIconWhite200x200.png";
import appBanner from "../assets/images/banners/appBanner600x400.png";




export function HomeScreen({ route, navigation }) {
  const [methodList, setMethodList] = useState(methodObjects);
  const [listLoaded, setListLoaded] = useState(false);

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
        }},[user])


  
       

  

  const favoritesDisplay = (
    <TouchableOpacity
      style={[styles.categoryTouchable, { backgroundColor: "#FD7908" }]}
      onPress={() => navigation.navigate("Favorites")}
    >
      <Text style={styles.categoryText}>Favorites</Text>
      <Image style={styles.methodIcon} source={favoriteIcon} />

    </TouchableOpacity>
  );

  const MethodDisplay = () => {
    if(listLoaded===false){
      return<ActivityIndicator/>
    }
    else{
    return(
    Object.values(methodList)
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
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <ImageBackground
            resizeMode="cover"
            style={styles.imageBackground}
            source={appBanner}
          >
            <Text style={styles.mainTitleText}>modern coffee</Text>
          </ImageBackground>
      <ScrollView style={styles.scrollViewStyle} contentContainerStyle={{flexDirection: "row", flexWrap:"wrap", justifyContent:"space-around"}}>
        {favoritesDisplay}
        <MethodDisplay />
        <TouchableOpacity
          style={styles.addItemTouchable}
          onPress={() => navigation.navigate("Create Recipe")}
        >
          <Text style={[styles.categoryText, {color: "white" }]}>
            Create Recipe
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
