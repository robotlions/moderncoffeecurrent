import { ScrollView, TouchableOpacity, Text, View, SafeAreaView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Functions from './Functions';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { Timer } from './Timer';
import { scale } from './Styles';
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList, {
  ScaleDecorator,
  NestableScrollContainer,
   NestableDraggableFlatList
} from "react-native-draggable-flatlist";



export function DisplayRecipe({ route, navigation }) {



  const loadedID = route.params.loadedID;
  const loadedRecipe = route.params.loadedRecipe;
  const [loading, setLoading] = useState(true);
  const [loadedMethods, setLoadedMethods] = useState("");


  useFocusEffect(
    useCallback(() => {
    if (loading === true) {
      database()
        .ref(`/users/${user.uid}/methods/`)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            setLoadedMethods(snapshot.val())
            setLoading(false)
          } else {
            console.log("No data available");
          }
        })

        .catch((error) => {
          console.error(error);
        });
    }
  }, []));



  function addRemoveStar() {
    loadedRecipe.favorite == true ? loadedRecipe.favorite = false : loadedRecipe.favorite = true
    database()
      .ref(`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}/`)
      .update(
        {
          favorite: loadedRecipe.favorite,
        }
      );
    alert("Updated!")
    navigation.navigate("Home");
  }


  const user = auth().currentUser;


  const editDisplay = Object.entries(loadedRecipe)
  .sort(([akey, avalue], [bkey, bvalue])=> avalue.order-bvalue.order)
  .filter(([key, value]) => key != "favorite" && key != "method" && key!= "order")
  .map(([key, value], index) => <View style={{ elevation: 1, backgroundColor: "white", marginBottom: 5 }} key={index}><Text style={{ fontFamily: "Raleway-Bold", paddingLeft: 10 }}>{key}</Text><Text style={{ paddingLeft: 10, fontFamily: "Raleway-Medium" }}>{value.variableValue}</Text></View>)



  return (
    <>
      <ScrollView>
        <Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, paddingLeft: 10, marginBottom: 10 }}>{route.params.loadedRecipe["Recipe Name"].variableValue}</Text>
        {editDisplay}
        <Text style={{ textAlign: "center" }}>
        <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate("Edit", { loadedID: loadedID, loadedRecipe: loadedRecipe })}><Text style={styles.modalButtonText}>Edit</Text></TouchableOpacity>
        <Functions.DeleteModule navigation={navigation} endpoint={`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}`} reset={() => reset()} buttonStyle={styles.modalButton} buttonTextStyle={styles.modalButtonText} />
        {"\n"}
        <TouchableOpacity onPress={() => addRemoveStar()}><Text style={styles.modalButtonText}>{loadedRecipe.favorite == true ? "Remove from Favorites" : "Add to Favorites"}</Text></TouchableOpacity>
        {"\n"}
        </Text>
      
     
      </ScrollView>
      
      <View style={{ backgroundColor: "white", height: 20 * scale, borderTopWidth: .5, borderColor: "gray" }}>
        <Timer />
      </View>
      </>
  )
}