import { useEffect, useState } from 'react';
import { Alert, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from './Styles';
import { Picker } from "@react-native-picker/picker";
import { methodTemplate } from '../Data/Models';
import database from '@react-native-firebase/database';



export const NewVariableInput = (props) => {
  const [thisState, setThisState] = useState("");

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Input new variable"
        value={thisState}
        onChangeText={setThisState}
      >
      </TextInput>
      <TouchableOpacity
        onPress={() => { pushNewVariable({methodName: thisState}, props.endpoint, props.navigation), setThisState(""), props.setLoading(true) }}>
        <Text style={styles.modalButtonText}>Save</Text></TouchableOpacity>
    </>
  )
};



export const EditInputWindow = (props) => {

  useEffect(() => {
    dataObject[props.item.variableName] = {variableValue: varState, order: props.item.order};
  });

  const [varState, setVarState] = useState(String(props.itemValue.variableValue));
  return (
    <TextInput
      style={styles.input}
      placeholder={props.itemKey}
      value={varState}
      onChangeText={setVarState}
      onEndEditing={() => dataObject[props.item.variableName] = {variableValue: varState, order: props.item.order}}
    />
  )
};

export const PickerDisplay = (props) => {

  useEffect(() => {
    props.dataObject.method = props.method;
  });

  const pickerMethodList = methodTemplate
  .sort((a,b) => a.order-b.order)
    .filter((item) => item != "Favorites" && item != "Recent")
    .map((item, index) => <Picker.Item key={index} label={item} value={item} />
    );

  const userMethods = Object.values(props.loadedMethods).map((item, index) => <Picker.Item key={index} label={item} value={item} />)
  return (
    <Picker
      style={styles.picker}
      selectedValue={props.method}
      onValueChange={(itemValue, itemIndex) => { props.setMethod(itemValue), props.dataObject.method = itemValue }}
    >
      <Picker.Item
        color="gray"
        enabled={false}
        label="Select Brewing Method"
        value=""
      />
      {pickerMethodList}
      {userMethods}
    </Picker>
  )
};



export const DeleteModule = (props) => {

  function deleteAlert() {
    Alert.alert(
      `Delete-O-Matic`,
      `Are you sure?`,
      [
        {
          text: `Delete`,
          onPress: () => deleteSelected(),
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


  function deleteSelected() {
    database()
      .ref(props.endpoint)
      .remove()
      .then(() => props.navigation.goBack());
  }
  return (
    <TouchableOpacity style={props.buttonStyle} onPress={() => deleteAlert()}>
      <Text style={props.buttonTextStyle}>Delete</Text></TouchableOpacity>
  )

}



export function getData(props) {
  database()
    .ref(props.endpoint)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {

        props.setLoadedData(Object.entries(snapshot.val()))

      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
};


export function pushNewVariable(dataObject, endpoint, navigation) {
  dataObject.order = 0;
  database().ref(endpoint).once('value').then((snapshot)=>{snapshot.numChildren()+1})
  database()
    .ref(endpoint)
    .push()
    .push(dataObject),
    alert("Added!")
}

export function updateEntry(dataObject, endpoint, navigation) {
  database()
    .ref(endpoint)
    .update(dataObject),
    alert("Updated!")
  navigation.navigate("Home");
}