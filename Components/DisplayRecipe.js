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

type Item = {
  key: string;
  label: string;
  height: number;
  width: number;
};




export function DisplayRecipe({ route, navigation }) {

  // const initialData: Item[] = [...Object.entries(route.params.loadedRecipe).filter(([key, value]) => key != "favorite" && key != "method")].map(([key, value], index) => {
  //   return {
  //     key: `item-${index}`,
  //     label: key,
  //     height: 100,
  //     width: 60 + Math.random() * 40,
  //   };
  // });



  const loadedID = route.params.loadedID;
  const loadedRecipe = route.params.loadedRecipe;
  const [loading, setLoading] = useState(true);
  const [loadedMethods, setLoadedMethods] = useState("");
  // const [data, setData] = useState(initialData);


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





  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
     
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={{ elevation: 1, backgroundColor: "white", marginBottom: 5 }}
        >
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
     
    );
  };

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
    // <NestableScrollContainer>
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
       {/* <NestableDraggableFlatList
    data={data}
    onDragEnd={({ data }) => setData(data)}
    keyExtractor={(item) => item.key}
    renderItem={renderItem}
    /> */}
     
      </ScrollView>
      
      <View style={{ backgroundColor: "white", height: 20 * scale, borderTopWidth: .5, borderColor: "gray" }}>
        <Timer />
      </View>
      </>
      // </NestableScrollContainer>
  )
}