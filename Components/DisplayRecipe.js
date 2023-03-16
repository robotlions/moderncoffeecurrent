import { ScrollView, TouchableOpacity, Alert, Text, TextInput, View } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
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
    // navigation.navigate("Home");
    navigation.goBack();
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
    .filter(([key, value]) => key != "favorite" && key != "method" && key != "order" && key != "backgroundColor")
    .map(([key, value], index) => editing == true && activeEdit == key ?

      <View key={index}>
        <TextInput
        autoFocus={true}
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
      <TouchableOpacity onLongPress={() => selectVariable(key, value.variableValue)}  style={styles.recipeVariableTouchable} key={index}>
        <Text style={{ fontFamily: "Raleway-Bold", paddingLeft: 10 }}>{key}</Text>
        <Text style={{ paddingLeft: 10, fontFamily: "Raleway-Medium" }}>{value.variableValue}</Text>
      </TouchableOpacity>)

function deleteAlert(endpoint) {
  Alert.alert(
    `Delete-O-Matic`,
    `Are you sure? This will permanently delete "${loadedRecipe["Recipe Name"].variableValue}".`,
    [
      {
        text: `Delete`,
        onPress: () => deleteSelected(endpoint),
        style: "cancel",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ],
    {
      cancelable: true,
    }
  );
}


function deleteSelected(endpoint) {
  database()
    .ref(endpoint)
    .remove()
    // reset();
  .then(() => navigation.goBack());
}

  return (

    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", fontSize: 18, paddingLeft: 10, marginBottom: 10}}>{route.params.loadedRecipe["Recipe Name"].variableValue}</Text>
        {editDisplay}
        <View style={{flex:1, flexDirection: "row", justifyContent: "space-around"}}>
          <TouchableOpacity onPress={() => navigation.navigate("Edit", { loadedID: loadedID, loadedRecipe: loadedRecipe })}><Text style={[styles.modalButtonText, {textAlign: "center"}]}>Edit Recipe</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => deleteAlert(`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}/`)}><Text style={[styles.modalButtonText, {textAlign: "center"}]}>Delete Recipe</Text></TouchableOpacity>
          </View>
          
          <TouchableOpacity style={{marginTop: 10, marginBottom: 10}} onPress={() => addRemoveStar()}><Text style={[styles.modalButtonText, {textAlign: "center"}]}>{loadedRecipe.favorite == true ? "Remove from Favorites" : "Add to Favorites"}</Text></TouchableOpacity>
          
        


      </ScrollView>

      {!editing && <View style={{ backgroundColor: "white", height: 20 * scale, borderTopWidth: .5, borderColor: "gray" }}>
        <Timer />
      </View>}
    </>
  )
}