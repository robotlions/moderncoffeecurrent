import { ScrollView, TouchableOpacity, Text, TextInput, View, SafeAreaView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Functions from './Functions';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { Timer } from './Timer';
import { scale } from './Styles';
import { useFocusEffect } from '@react-navigation/native';




export function DisplayRecipe({ route, navigation }) {



  const loadedID = route.params.loadedID;
  // const loadedRecipe = route.params.loadedRecipe;
  const [loadedRecipe, setLoadedRecipe] = useState({});
  // const [loading, setLoading] = useState(true);
  const [loadedMethods, setLoadedMethods] = useState("");
  const [loadedMethod, setLoadedMethod] = useState(route.params.loadedMethod);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [editValue, setEditValue] = useState("");



  useFocusEffect(
    useCallback(() => {
      let loading = true
      if (loading === true) {
        database()
          .ref(`/users/${user.uid}/methods/`)
          .once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              setLoadedMethods(snapshot.val())
            } else {
              console.log("No data available");
            }
          })

          .catch((error) => {
            console.error(error);
          });

          database()
          .ref(`/users/${user.uid}/recipes/${loadedMethod}/${loadedID}/`)
          .once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              setLoadedRecipe(snapshot.val())
            } else {
              console.log("No data available");
            }
          })

          .catch((error) => {
            console.error(error);
          });
      }
      return(()=>{loading = false})
    }, [editing]));


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

  function selectVariable(key, value) {
    setEditing(true);
    setActiveEdit(key)
    setEditValue(value);
  }

  function unSelect(key, value) {
    database()
      .ref(`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}/${key}/`)
      .update({ variableValue: editValue })
    setEditing(false);
    setActiveEdit(null);
    setEditValue("");
  }


  const user = auth().currentUser;


  const editDisplay = Object.entries(loadedRecipe)
    .sort(([akey, avalue], [bkey, bvalue]) => avalue.order - bvalue.order)
    .filter(([key, value]) => key != "favorite" && key != "method" && key != "order")
    .map(([key, value], index) => editing == true && activeEdit == key ?

      <View key={index}>
        <TextInput
          style={[styles.input, { width: "100%", paddingLeft: 10 }]}
          value={editValue}
          onChangeText={setEditValue}
          placeholder={key} />
        <TouchableOpacity onPress={() => unSelect(key, value)}>
          <Text style={{ textAlign: "right", paddingRight: 10, fontFamily: "Raleway-Medium", color: "green" }}>
            DONE
          </Text>
        </TouchableOpacity>
      </View>
      :
      <TouchableOpacity onLongPress={() => selectVariable(key, value.variableValue)} style={{ elevation: 1, backgroundColor: "white", marginBottom: 5 }} key={index}>
        <Text style={{ fontFamily: "Raleway-Bold", paddingLeft: 10 }}>{key}</Text>
        <Text style={{ paddingLeft: 10, fontFamily: "Raleway-Medium" }}>{value.variableValue}</Text>
      </TouchableOpacity>)



  return (

    <>
      <ScrollView>
        <Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, paddingLeft: 10, marginBottom: 10 }}>{route.params.loadedRecipe["Recipe Name"].variableValue}</Text>
        {editDisplay}
        <Text style={{ textAlign: "center" }}>
          <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate("Edit", { loadedID: loadedID, loadedRecipe: loadedRecipe })}><Text style={styles.modalButtonText}>Edit</Text></TouchableOpacity>
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