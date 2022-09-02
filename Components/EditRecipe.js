import { ScrollView, TouchableOpacity, Text, View, TextInput, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as Functions from './Functions';
import { styles } from './Styles';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { methodTemplate } from '../Data/Models';
import { Picker } from "@react-native-picker/picker";
import { scale } from './Styles';

import DraggableFlatList, {
  ScaleDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList
} from "react-native-draggable-flatlist";




function EditInputWindow(props) {


  useEffect(() => {
    props.dataObject[props.itemKey] = { variableValue: varState, order: props.itemValue.order };
  });

  const [varState, setVarState] = useState(String(props.itemValue.variableValue));
  return (
    <TextInput
      style={styles.input}
      placeholder={props.itemKey}
      value={varState}
      onChangeText={setVarState}
      onEndEditing={() => props.dataObject[props.itemKey] = { variableValue: varState, order: props.itemValue.order }}
    />
  )
};




export function EditRecipe({ route, navigation }) {
  let dataObject = {};

  const loadedID = route.params.loadedID;
  const loadedRecipe = route.params.loadedRecipe;
  const [method, setMethod] = useState(route.params.loadedRecipe.method);
  const [loadedMethods, setLoadedMethods] = useState("");
  const [data, setData] = useState([]);
  const [dragWindowVisible, setDragWindowVisible] = useState(false);

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
      return (() => { loading = false })
    }, []));

  const user = auth().currentUser;



  const editDisplay = Object.entries(loadedRecipe)
    .sort(([akey, avalue], [bkey, bvalue]) => avalue.order - bvalue.order)
    .filter(([key, value]) => key != "order" && key != "method" && key != "favorite")
    .map(([key, value], index) => <View key={index} style={{ width: "100%", alignItems: "center", marginBottom: 5 }}><Text style={{ fontFamily: "Raleway-Bold", textAlign: "left" }}>{key}</Text><EditInputWindow key={index} itemKey={key} itemValue={value} dataObject={dataObject} /></View>)


  function updateEntry() {
    database()
      .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
      .update(dataObject),
      alert("Updated!")
    navigation.goBack();
  }

  const pickerMethodList = Object.values(loadedMethods)
    .sort((a, b) => a.order - b.order)
    .filter((item) => item != "Favorites" && item != "Recent")
    .map((item, index) => <Picker.Item key={index} label={item.methodName} value={item.methodName} />
    );

  const flatlistHeader = <View><Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, paddingLeft: 10, marginBottom: 10 }}>{route.params.loadedRecipe["Recipe Name"].variableValue}</Text>

    <Text style={[styles.modalButtonText, { textAlign: "center", marginBottom: 5 }]}>Drag to reorder</Text></View>


  const flatlistFooter = <View><Text style={{ textAlign: "center" }}>

    <TouchableOpacity style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }} onPress={() => setDragWindowVisible(false)}><Text style={styles.modalButtonText}>Edit Recipe</Text></TouchableOpacity>
  </Text>
    <Text style={{ textAlign: "center" }}>
      <Functions.DeleteModule navigation={navigation} endpoint={`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}`} reset={() => reset()} buttonStyle={styles.modalButton} buttonTextStyle={styles.modalButtonText} />
    </Text></View>

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


  useEffect(() => {
    let initialData = Object.entries(loadedRecipe)
      .filter((item) => item[0] != "order" && item[0] != "favorite" && item[0] != "method")
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
  }, [loadedRecipe]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
<ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ elevation: 1, backgroundColor: "white", marginBottom: 5 }}
      >
        <View style={styles.variableEntry}><Text style={{ maxWidth: "80%", fontFamily: "Raleway-Medium", fontSize: 16 }}>{item.id} - {item.label}</Text>
          {item.id != "Recipe Name" && item.id != "Description" && <TouchableOpacity style={styles.buttonStyle} onPress={() => deleteAlert(`/users/${user.uid}/recipes/${method}/${loadedID}/${item.id}`)}>
            <Text style={styles.deleteButton}>Delete</Text></TouchableOpacity>}
        </View>
      </TouchableOpacity>
</ScaleDecorator>
    );
  };

  function setIndices(data) {
    data.forEach((item, index) => {
      database()
        .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/${item.id}/`)
        .update({ order: index })
      // console.log(item.id)
    })
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
      .remove()
    // .then(() => props.navigation.goBack());
  }

  if (!dragWindowVisible) {
    return (
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {pickerDisplay}
        {editDisplay}
        <TouchableOpacity style={{ marginTop: 10, marginBottom: 10 }} onPress={() => setDragWindowVisible(true)}><Text style={styles.modalButtonText}>Rearrange Order</Text></TouchableOpacity>

        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => updateEntry()}><Text style={styles.modalButtonText}>Save Edits</Text></TouchableOpacity>
      </ScrollView>
    )
  }


  if (dragWindowVisible) {
    return (

      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => { setData(data), setIndices(data) }}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        ListHeaderComponent={() => flatlistHeader }
        ListFooterComponent={()=> flatlistFooter}
      />
    )
    
  }
}