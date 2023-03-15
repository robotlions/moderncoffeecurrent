import { Alert, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';


const NewMethodInput = (props) => {
  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [bgColor, setBGColor] = useState(0);
  const [loading, setLoading] = useState(true);
  
  
  database().ref(props.endpoint).once('value').then((snapshot)=>{setOrderCount(snapshot.numChildren()+1)})


  const colorPalette={
    1: "#A67C83",
    2: "#7A5546",
    3: "#5B3118",
    4: "#734729",
    5: "#AB3625",
    6: "#935230",
    7: "#9E6D5C",
    8: "#C99074",
    9: "#B68576",
    10: "#B98D8B",
    11: "#D1A59E",
  }

  function doRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

 
    if(loading===true){
    
      let colorPick = doRandom(1,11)
      setBGColor(colorPalette[colorPick])
      setLoading(false);
    }
  

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
        onPress={() => { pushNewVariable({methodName: thisState, order:orderCount, backgroundColor: bgColor}, props.endpoint, props.navigation), setThisState(""), props.setLoading(true) }}>
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
  const [editInput, setEditInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);



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
        `Are you sure? This will permanently remove this method and all of its receipes.`,
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
    
     function editMethodName(methodName){
      setEditInput(methodName)
      setEditing(!editing)
      setActiveEdit(methodName)
     }

     function updateMethodName(endpoint){
      database()
      .ref(`/users/${user.uid}/methods/${endpoint}`)
      .update({methodName: editInput})
      setEditing(false);
      setEditInput("");
      setActiveEdit(null);
      reset();
     }
  

  

  const userMethodDisplay = Object.entries(loadedMethods)
  .sort((a,b)=> a[1].order - b[1].order)
  .map((item, index) => 
  <View style={styles.variableEntry} key={index}>

    {editing===true && activeEdit===item[1].methodName
    ?
    <TextInput
    style={[styles.input, {width: "50%"}]}
    value={editInput}
    onChangeText={setEditInput}
  >
  </TextInput> 
    :
     <Text style={styles.variableText}>{item[1].methodName}</Text>}
  <Text>
  {editing===true && activeEdit===item[1].methodName
  ?
  <TouchableOpacity style={styles.buttonStyle} onPress={()=>updateMethodName(item[0])}>
    <Text style={[styles.buttonTextStyle, {marginRight: 20, color: "#fd7908"}]}>Save</Text></TouchableOpacity>
  :
  <TouchableOpacity style={styles.buttonStyle} onPress={() => editMethodName(item[1].methodName)}>
  <Text style={[styles.buttonTextStyle, {marginRight: 20, color: "#fd7908"}]}>Edit</Text></TouchableOpacity>
}
  <TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/methods/${item[0]}`)}>
  <Text style={styles.buttonTextStyle}>Delete</Text></TouchableOpacity>
  </Text>
  </View>)

  return (
    <ScrollView style={{marginLeft: 5, marginRight: 5}}>
      <Text style={[styles.entryHeadline, {textAlign:"center", marginBottom:10}]}>Manage brew methods</Text>
      {userMethodDisplay}
      <NewMethodInput endpoint={`/users/${user.uid}/methods/`} user={user} navigation={navigation} setLoading={setLoading} />
    </ScrollView>
  )
}
