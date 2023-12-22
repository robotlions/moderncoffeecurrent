import { Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";
import { useState, useEffect } from "react";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

export function HomeScreen({ route, navigation }) {
  const user = auth().currentUser;
  const [methodList, setMethodList] = useState({});

  

    useEffect(()=>{
        if(user){
        database()
          .ref(`/users/${auth().currentUser.uid}/methods/`)
          .on("value", (snapshot) => {
             console.log("updating from home screen")
                setMethodList(snapshot.val());
              })
        }},[user])


  

  

  

  const favoritesDisplay = (
    <TouchableOpacity
      style={[styles.categoryTouchable, { backgroundColor: "#FD7908" }]}
      onPress={() => navigation.navigate("Favorites")}
    >
      <Text style={styles.categoryText}>Favorites</Text>
    </TouchableOpacity>
  );

  const methodDisplay = Object.values(methodList)
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
          })
        }
      >
        <Text style={styles.categoryText}>{item.methodName}</Text>
      </TouchableOpacity>
    ));

  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />

      <ScrollView style={styles.scrollViewStyle}>
        {favoritesDisplay}
        {methodDisplay}
        <TouchableOpacity
          style={styles.addItemTouchable}
          onPress={() => navigation.navigate("Create Recipe")}
        >
          <Text style={[styles.categoryText, { color: "white" }]}>
            Create Recipe
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
