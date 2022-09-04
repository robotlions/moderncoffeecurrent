import { Alert, Text, View, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as Functions from "./Functions";
import { useState, useEffect, useCallback } from 'react';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import hamburgerIcon from '../assets/images/hamburgerIcon.png';

import DraggableFlatList, {
  ScaleDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList
} from "react-native-draggable-flatlist";




const NewVariableInput = (props) => {

  database()
    .ref(props.endpoint)
    .once('value')
    .then((snapshot) => { setOrderCount(snapshot.numChildren() + 1) })

  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0)

  return (
    <>
      <TextInput
        style={[styles.input, { width: "100%", paddingLeft: 10, backgroundColor: "white", borderColor: "white" }]}
        placeholder="Input new variable"
        value={thisState}
        onChangeText={setThisState}
      >
      </TextInput>
      {thisState != "" && <TouchableOpacity
        style={{ paddingBottom: 10, paddingTop: 10 }}
        onPress={() => { props.pushNewVariable({ variableName: thisState, order: orderCount }, props.endpoint, props.navigation), setThisState(""), props.setLoading(true) }}>
        <Text style={[styles.modalButtonText, { textAlign: "center", fontSize: 20 }]}>Save New Variable</Text></TouchableOpacity>}
    </>
  )
};




export function RecipeTemplate({ route, navigation }) {

  const user = auth().currentUser;
  const [loadedVariables, setLoadedVariables] = useState({});
  const [loadedMethods, setLoadedMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);


  useEffect(() => {
    let initialData = Object.entries(loadedVariables)
      .sort((a, b) => a[1].order - b[1].order)
      .map((item, index) => {
        return {
          id: item[0],
          key: `item-${index}`,
          label: item[1].variableName,
          order: item[1].order,
          height: 100,
        }
      });
    setData(initialData);
  }, [loadedVariables]);


  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (active = true) {
        database()
          .ref(`/users/${user.uid}/variables/`)
          .once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              setLoadedVariables(snapshot.val());
            } else {
              setLoadedVariables({})
              console.log("No data available");
            }
          })
      }
      return (() => {
        active = false;
      })
    }, []))






  const renderItem = ({ item, drag, isActive }) => {
    return (
      
        <TouchableOpacity
              style={{ height: 50, elevation: 1, backgroundColor: "white", marginBottom: 5 }}

          onLongPress={drag}
          disabled={isActive}
        >
          <Image source={hamburgerIcon} style={{marginLeft: 10, opacity:.7, marginTop: 3, position: "absolute", marginRight: 10}}/>
        
          <View style={[styles.variableEntry, {paddingLeft:70}]}><Text style={styles.variableText}>{item.label}</Text>
            {item.label != "Recipe Name" && item.label != "Description" && <TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/variables/${item.id}`)}>
              <Text style={styles.deleteButton}>Delete</Text></TouchableOpacity>}
          </View>
        </TouchableOpacity>
    );
  };


  function setIndices(data) {
    data.forEach((item, index) => {
      database()
        .ref(`/users/${user.uid}/variables/${item.id}/`)
        .update({ order: index })
    })
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

  function pushNewVariable(dataObject, endpoint, navigation) {

    database()
      .ref(endpoint)
      .push(dataObject),
      alert("Added!")
    reset();
  }

  function reset() {
    database()
      .ref(`/users/${user.uid}/variables/`)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          setLoadedVariables(snapshot.val());
        } else {
          setLoadedVariables({})
          console.log("No data available");
        }
      })
  }

  // const userVariableDisplay = Object.entries(loadedVariables)
  //   .sort((a, b) => a[1].order - b[1].order)
  //   .filter((item) => item[1].variableName != "Recipe Name" && item[1].variableName != "Description")
  //   .map((item, index) =>
  //     <View style={styles.variableEntry} key={index}><Text style={styles.variableText} >{item[1].variableName}</Text><TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/variables/${item[0]}`)}>
  //       <Text style={styles.deleteButton}>Delete</Text></TouchableOpacity></View>)



  return (



    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => { setData(data), setIndices(data) }}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={() => <Text style={[styles.modalButtonText, { textAlign: "center", marginBottom: 5 }]}>Drag to reorder</Text>
      }
      ListFooterComponent={() => <NewVariableInput pushNewVariable={pushNewVariable} endpoint={`/users/${user.uid}/variables/`} user={user} navigation={navigation} setLoading={setLoading} />}

    />

  )
}

