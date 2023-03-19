import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { styles } from "./Styles";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { methodObjects, variableObjects } from "../Data/Models";

export function HomeScreen({ route, navigation }) {
  const user = auth().currentUser;
  const [methodList, setMethodList] = useState({});

  


  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      database()
        .ref(`/users/${user.uid}/methods/`)
        .on("value", (snapshot) => {
          if (isActive) {
            if (!snapshot.exists()) {
              createDatabaseEntries()
            }
            else
             {
              setMethodList(snapshot.val());
            }
          }
        });
      return () => {
        isActive = false;
      };
    }, [user])
  );


  function createDatabaseEntries() {
    database()
      .ref(`/users/${auth().currentUser.uid}/methods/`)
      .once("value", (snapshot) => {
        if (!snapshot.exists()) {
          methodObjects.forEach((item) => {
            database().ref(`/users/${auth().currentUser.uid}/methods/`).push(item);
          });
        }
      });
    database()
      .ref(`/users/${auth().currentUser.uid}/variables/`)
      .once("value", (snapshot) => {
        if (!snapshot.exists()) {
          variableObjects.forEach((item) => {
            database().ref(`/users/${auth().currentUser.uid}/variables/`).push(item);
          });
        }
      });
  }



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
