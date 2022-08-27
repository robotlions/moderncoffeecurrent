import { Alert, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as Functions from "./Functions";
import { useState, useEffect, useCallback } from 'react';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';





export function RecipeTemplate({ route, navigation }) {

  const user = auth().currentUser;
  const [loadedVariables, setLoadedVariables] = useState({});
  const [loadedMethods, setLoadedMethods] = useState({});
  const [loading, setLoading] = useState(true);




  function getData() {
    database()
    .ref(`/users/${user.uid}/variables/`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        setLoadedVariables(snapshot.val())
      } else {
        setLoadedVariables({})
        console.log("No data available");
      }
    })
  }

  useEffect(() => {
    if (loading === true) {
      getData();
      setLoading(false);
    }
  });

  function reset() {
    setLoading(true)
   
  }

  

    function deleteAlert(endpoint) {
      Alert.alert(
        `Delete-O-Matic`,
        `Are you sure?`,
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
        reset();
        // .then(() => props.navigation.goBack());
    }
    
  


  const NewVariableInput = (props) => {
    const [thisState, setThisState] = useState("");
    const [orderCount, setOrderCount] = useState(0)
    
    database().ref(props.endpoint).once('value').then((snapshot)=>{setOrderCount(snapshot.numChildren()+1)})
  
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
          onPress={() => { pushNewVariable({variableName: thisState, order:orderCount}, props.endpoint, props.navigation), setThisState(""), props.setLoading(true) }}>
          <Text style={styles.modalButtonText}>Save</Text></TouchableOpacity>
      </>
    )
  };

  function pushNewVariable(dataObject, endpoint, navigation) {
    
    
    database()
      .ref(endpoint)
      .push(dataObject),
      alert("Added!")
  }


  const userVariableDisplay = Object.entries(loadedVariables).map((item, index) => 
  <View style={styles.variableEntry} key={index}><Text  style={styles.variableText} >{item[1].variableName}</Text><TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/variables/${item[0]}`)}>
  <Text style={styles.deleteButton}>Delete</Text></TouchableOpacity></View>)


  return (
    <ScrollView style={{marginLeft: 5, marginRight: 5}}>
      <Text style={[styles.entryHeadline, {paddingLeft: 0, marginBottom:10}]}>Manage Recipe Template</Text>
      {userVariableDisplay}
      <NewVariableInput endpoint={`/users/${user.uid}/variables/`} user={user} navigation={navigation} setLoading={setLoading} />
    </ScrollView>
  )
}
