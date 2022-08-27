import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { variableArrayDefault, variableTemplate } from '../Data/Models';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { methodTemplate } from '../Data/Models';
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from '@react-navigation/native';
import { variableObjects } from '../Data/Models';



function InputWindow(props) {

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {

        setVarState("")
      }
      return () => {
        isActive = false;
      };
    }, []));

  useEffect(() => {
    dataObject[props.item.variableName] = {variableValue: varState, order: props.item.order};
  });

  const [varState, setVarState] = useState("");

  return (
    <TextInput
      style={styles.input}
      placeholder={props.item.variableName}
      value={varState}
      onChangeText={setVarState}
      onEndEditing={() => dataObject[props.item.variableName] = {variableValue: varState, order: props.item.order}}
    />
  )
};
let dataObject = {};

export function CreateRecipe({ route, navigation }) {

  const user = auth().currentUser;
  const [method, setMethod] = useState("");
  const [loadedMethods, setLoadedMethods] = useState({});
  const [order, setOrder] = useState(0);
  const [variableList, setVariableList] = useState([]);


  

  useFocusEffect(
    useCallback(() => {
      let varArray = [];
      let isActive = true;
      if (isActive) {
        dataObject = {};
        setMethod(route.params ? route.params.method : "")
      }

      database()
        .ref(`/users/${user.uid}/methods/`)
        .on('value', snapshot => {

          if (isActive) {
            if (snapshot.exists()) {
              setLoadedMethods(snapshot.val())
            } else {
              setLoadedMethods({})
              // console.log("No data available");
            }
          }
        })
      database()
        .ref(`/users/${user.uid}/variables/`)
        .once('value')
        .then((snapshot) => {
          if (isActive) {
            if (snapshot.exists()) {
              snapshot.forEach((baby) => { varArray.push(baby.val()) })
              setVariableList(varArray)
            }
            else {
              variableObjects.forEach((item) => {
                database().ref(`/users/${user.uid}/variables/`)
                  .push(item);
              })
            }
          } else {
            console.log("No data available");
          }
        })
      return () => {
        isActive = false;
      };
    }, [])
  );

  //this useEffect listens for a change to {method}, then reads the database node of that method
  //then sets a variable in state: Order, which is 1 higher than the number of entries in that
  //node
  useEffect(() => {
    database()
      .ref(`/users/${user.uid}/recipes/${method}`)
      .once('value')
      .then((snapshot) => {
        setOrder(snapshot.numChildren() + 1)
      })
  }, [method]);

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


  const inputDisplay = variableList
    .sort((a, b) => a.order - b.order)
    .map((item, index) =>
      <InputWindow key={index} dataObject={dataObject} item={item} />)




  function pushNewEntry() {
    dataObject.method = method;
    dataObject.order = order;
    database()
      .ref(`/users/${user.uid}/recipes/${method}`)
      .push()
      .set(dataObject);
    alert("Added!");
    navigation.goBack();
  }



  return (

    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      {pickerDisplay}
      {inputDisplay}
      <TouchableOpacity onPress={() => method == "" ? alert("Please choose brew method") : pushNewEntry()}><Text style={[styles.modalButtonText, { marginTop: 10, marginBottom: 10, fontSize: 25 }]}>Save Recipe</Text></TouchableOpacity>
    </ScrollView>

  );
}