import { ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Functions from './Functions';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';


function EditInputWindow(props) {

  // useFocusEffect(
  //   useCallback(() => {
  //     let isActive = true;
  //     if (isActive) {

  //       setVarState("")
  //     }
  //     return () => {
  //       isActive = false;
  //     };
  //   }, []));

  useEffect(() => {
    dataObject[props.itemKey] = {variableValue: varState, order: props.itemValue.order};
  });

  const [varState, setVarState] = useState(String(props.itemValue.variableValue));
  return (
    <TextInput
      style={styles.input}
      placeholder={props.itemKey}
      value={varState}
      onChangeText={setVarState}
      onEndEditing={() => dataObject[props.itemKey] = {variableValue: varState, order: props.itemValue.order}}
    />
  )
};


let dataObject = {};
export function EditRecipe({ route, navigation }) {

  const loadedID = route.params.loadedID;
  const loadedRecipe = route.params.loadedRecipe;
  // const [dataObject, setDataObject] = useState(route.params.loadedRecipe);
  const [method, setMethod] = useState(route.params.loadedRecipe.method);
  const [loading, setLoading] = useState(true);
  const [loadedMethods, setLoadedMethods] = useState("");

  useEffect(() => {
    if (loading === true) {
      dataObject = route.params.loadedRecipe;
      database()
        .ref(`/users/${user.uid}/userAdded/methods/`)
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
  });

  const user = auth().currentUser;



  const editDisplay = Object.entries(loadedRecipe)
  .sort(([akey, avalue], [bkey, bvalue])=>avalue.order-bvalue.order)
  .filter(([key, value]) => key!="order" && key != "method"&&key!="favorite")
  .map(([key, value], index) => <EditInputWindow key={index} itemKey={key} itemValue={value} />)


  function updateEntry() {
    database()
      .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
      .update(dataObject),
      alert("Updated!")
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <Functions.PickerDisplay loadedMethods={loadedMethods} dataObject={dataObject} method={method} setMethod={setMethod} />
      {editDisplay}
      <TouchableOpacity onPress={() => updateEntry()}><Text style={styles.modalButtonText}>Save Edits</Text></TouchableOpacity>
{/* <TouchableOpacity onPress={()=>console.log(`/users/${user.uid}/recipes/${method}/${loadedID}/`)}><Text>Console log</Text></TouchableOpacity> */}
    </ScrollView>
  )
}