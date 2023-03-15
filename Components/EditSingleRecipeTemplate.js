
import { TouchableOpacity, Text, View, TextInput, Alert, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Functions from './Functions';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import hamburgerIcon from '../assets/images/hamburgerIcon.png';
import updownIcon from '../assets/images/updownIcon.png';


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
        onPress={() => { props.pushNewVariable({ variableValue: "", order: orderCount }, `${props.endpoint}/${thisState}/`, props.navigation), setThisState(""), props.setLoading(true) }}>
        <Text style={[styles.modalButtonText, { textAlign: "center", fontSize: 20 }]}>Save New Variable</Text></TouchableOpacity>}
    </>
  )
};


export function EditSingleRecipeTemplate({ route, navigation }) {

  const user = auth().currentUser;

  const loadedID = route.params.loadedID;
  const [loadedRecipe, setLoadedRecipe] = useState({ ...route.params.loadedRecipe });
  const [method, setMethod] = useState(route.params.loadedRecipe.method);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let loading = true;
      if (loading === true) {
        database()
          .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
          .once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              setLoadedRecipe(snapshot.val());
            } else {
              console.log("No data available");
            }
          })

          .catch((error) => {
            console.error(error);
          });

      }
      return (() => { loading = false })
    }, []));


  useEffect(() => {
    let initialData = Object.entries(loadedRecipe)
      .filter((item) => item[0] != "order" && item[0] != "favorite" && item[0] != "method" && item[0] != "backgroundColor")
      .sort((a, b) => a[1].order - b[1].order)
      .map((item, index) => {
        return {
          id: item[0],
          key: `item-${index}`,
          label: item[1].variableValue,
          order: item[1].order,
        }
      });
    setData(initialData);
  }, [loadedRecipe])

  function reset() {
    database()
      .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          setLoadedRecipe(snapshot.val());
        } else {
          console.log("No data available");
        }
      })

      .catch((error) => {
        console.error(error);
      });
    
  }

  const flatlistHeader = <View>
    <Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, paddingLeft: 10, marginBottom: 10 }}>{route.params.loadedRecipe["Recipe Name"].variableValue}</Text>
    <Text style={[styles.modalButtonText, { textAlign: "center", marginBottom: 5 }]}>Drag to reorder</Text>
  </View>


  const flatlistFooter = <View>

    <Text style={{ textAlign: "center", marginBottom: 20 }}>
      <TouchableOpacity style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }} onPress={() => navigation.goBack()}><Text style={[styles.modalButtonText, {fontSize: 20}]}>Back to edit</Text></TouchableOpacity>
    </Text>
    {/* <Text style={{ textAlign: "center" }}>
      <Functions.DeleteModule navigation={navigation} endpoint={`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}`} reset={() => reset()} buttonStyle={styles.modalButton} buttonTextStyle={styles.modalButtonText} />
    </Text> */}
  </View>

  const renderItem = ({ item, drag, isActive }) => {
    return (
      
        <TouchableOpacity
              style={{ height:50, elevation: 1, backgroundColor: "white", marginBottom: 5 }}

          onLongPress={drag}
          disabled={isActive}
        >
          <View style={{flex: 1, justifyContent:"center"}}>

                    <Image source={updownIcon} style={{height:30, width: 30, marginLeft: 10, opacity:.5, marginTop: 3, position: "absolute", marginRight: 10}}/>


          <View style={[styles.variableEntry, {paddingLeft: 70}]}><Text style={{ maxWidth: "80%", fontFamily: "Raleway-Medium", fontSize: 16 }}>{item.id} - {item.label}</Text>
            {item.id != "Recipe Name" && item.id != "Description" && <TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/recipes/${method}/${loadedID}/${item.id}`)}>
              <Text style={styles.deleteButton}>Delete</Text></TouchableOpacity>}
          </View>
          </View>
          </TouchableOpacity>
        
    );
  };


  function pushNewVariable(dataObject, endpoint, navigation) {

    database()
      .ref(endpoint)
      .set(dataObject),
      alert("Added!")
    // setUpdate(!update);
  }

  function deleteAlert(endpoint) {
    Alert.alert(
      `Delete-O-Matic`,
      `Are you sure? This will permanently delete this variable from this recipe.`,
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
      .remove();
      reset();
    // .then(() => props.navigation.goBack());
  }

  function setIndices(data) {
    data.forEach((item, index) => {
      database()
        .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/${item.id}/`)
        .update({ order: index })
      // console.log(item.id)
    })
  }



  return (

    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => { setData(data), setIndices(data) }}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={flatlistHeader}
      ListFooterComponent={flatlistFooter}
    />
  )
}