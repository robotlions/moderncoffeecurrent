import { Alert, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';


const NewMethodInput = (props) => {
  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0)
  
  database().ref(props.endpoint).once('value').then((snapshot)=>{setOrderCount(snapshot.numChildren()+1)})

  return (
    <>
      <TextInput
        style={[styles.input, {width:"100%"}]}
        placeholder="Input new brewing method"
        value={thisState}
        onChangeText={setThisState}
      >
      </TextInput>
      {thisState != '' && <TouchableOpacity
        onPress={() => { pushNewVariable({methodName: thisState, order:orderCount}, props.endpoint, props.navigation), setThisState(""), props.setLoading(true) }}>
        <Text style={[styles.modalButtonText, {textAlign: "center"}]}>Save New Method</Text></TouchableOpacity>}
    </>
  )
};

function pushNewVariable(dataObject, endpoint, navigation) {
    
    
  database()
    .ref(endpoint)
    .push(dataObject),
    alert("Added!")
}


export function BrewMethods({ route, navigation }) {

  const user = auth().currentUser;
  const [loadedVariables, setLoadedVariables] = useState({});
  const [loadedMethods, setLoadedMethods] = useState({});
  const [loading, setLoading] = useState(true);




  function getData() {
    
    database()
    .ref(`/users/${user.uid}/methods/`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        setLoadedMethods(snapshot.val())
      } else {
        setLoadedMethods({})
        console.log("No data available");
      }
    })
    
    .catch((error) => {
      console.error(error);
    });
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
    
     
  

  

  const userMethodDisplay = Object.entries(loadedMethods)
  .sort((a,b)=> a[1].order - b[1].order)
  .map((item, index) => 
  <View style={styles.variableEntry} key={index}><Text style={styles.variableText}>{item[1].methodName}</Text><TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/methods/${item[0]}`)}>
  <Text style={styles.buttonTextStyle}>Delete</Text></TouchableOpacity></View>)

  return (
    <ScrollView style={{marginLeft: 5, marginRight: 5}}>
      <Text style={[styles.entryHeadline, {paddingLeft: 0, marginBottom:10}]}>Manage brew methods</Text>
      {userMethodDisplay}
      <NewMethodInput endpoint={`/users/${user.uid}/methods/`} user={user} navigation={navigation} setLoading={setLoading} />
    </ScrollView>
  )
}
