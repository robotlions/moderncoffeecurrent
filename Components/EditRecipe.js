import { ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Functions from './Functions';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { methodTemplate } from '../Data/Models';
import { Picker } from "@react-native-picker/picker";




function EditInputWindow(props) {


  useEffect(() => {
    props.dataObject[props.itemKey] = {variableValue: varState, order: props.itemValue.order};
  });

  const [varState, setVarState] = useState(String(props.itemValue.variableValue));
  return (
    <TextInput
      style={styles.input}
      placeholder={props.itemKey}
      value={varState}
      onChangeText={setVarState}
      onEndEditing={() => props.dataObject[props.itemKey] = {variableValue: varState, order: props.itemValue.order}}
    />
  )
};




export function EditRecipe({ route, navigation }) {
  let dataObject = {};

  const loadedID = route.params.loadedID;
  const loadedRecipe = route.params.loadedRecipe;
  // const [dataObject, setDataObject] = useState(route.params.loadedRecipe);
  const [method, setMethod] = useState(route.params.loadedRecipe.method);
  // const [loading, setLoading] = useState(true);
  const [loadedMethods, setLoadedMethods] = useState("");

  useFocusEffect(
  useCallback(() => {
    let loading = true;
    if (loading === true) {
      dataObject = route.params.loadedRecipe;
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
    }
    return(()=>{loading=false})
  }, []));

  const user = auth().currentUser;



  const editDisplay = Object.entries(loadedRecipe)
  .sort(([akey, avalue], [bkey, bvalue])=>avalue.order-bvalue.order)
  .filter(([key, value]) => key!="order" && key != "method"&&key!="favorite")
  .map(([key, value], index) => <EditInputWindow key={index} itemKey={key} itemValue={value} dataObject={dataObject}/>)


  function updateEntry() {
    database()
      .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
      .update(dataObject),
      alert("Updated!")
    navigation.goBack();
  }

  const pickerMethodList = Object.values(loadedMethods)
  .sort((a,b) => a.order-b.order)
    .filter((item) => item != "Favorites" && item != "Recent")
    .map((item, index) => <Picker.Item key={index} label={item.methodName} value={item.methodName} />
    );


  const pickerDisplay =

    <Picker
      style={styles.picker}
      selectedValue={method}
      onValueChange={(itemValue, itemIndex) => { setMethod(itemValue), dataObject.method = itemValue }}
    >
      <Picker.Item
        color="gray"
        enabled={false}
        label="Select Brewing Method"
        value=""
      />
      {pickerMethodList}
    </Picker>

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      {/* <PickerDisplay loadedMethods={loadedMethods} dataObject={dataObject} method={method} /> */}
      {pickerDisplay}
      {editDisplay}
      <TouchableOpacity onPress={() => updateEntry()}><Text style={styles.modalButtonText}>Save Edits</Text></TouchableOpacity>
{/* <TouchableOpacity onPress={()=>console.log(`/users/${user.uid}/recipes/${method}/${loadedID}/`)}><Text>Console log</Text></TouchableOpacity> */}
    </ScrollView>
  )
}