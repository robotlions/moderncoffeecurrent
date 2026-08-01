import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  getMethods,
  getRecipe,
  updateRecipe,
} from "../Data/Storage";

const NewVariableInput = (props) => {
  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    getRecipe(props.method, props.loadedID).then((recipe) => {
      setOrderCount(Object.keys(recipe || {}).length + 1);
    });
  }, []);

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Input new variable"
        value={thisState}
        onChangeText={setThisState}
      ></TextInput>
      {thisState != "" && (
        <TouchableOpacity
          style={{ paddingBottom: 10, paddingTop: 10 }}
          onPress={() => {
            props.addVariableToRecipe(thisState, orderCount),
              setThisState("");
            props.setLoading(!props.loading);
          }}
        >
          <Text
            style={[
              styles.modalButtonText,
              { textAlign: "center", fontSize: 20 },
            ]}
          >
            Save New Variable
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};



export function EditRecipe({ route, navigation }) {
  let dataObject = {};

  const loadedID = route.params.loadedID;
  const [loadedRecipe, setLoadedRecipe] = useState({
    ...route.params.loadedRecipe,
  });
  const [method, setMethod] = useState(route.params.loadedRecipe.method);
  const [loadedMethods, setLoadedMethods] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let gettingData = true;
      if (gettingData === true) {
        dataObject = route.params.loadedRecipe;
        getMethods().then((methods) => {
          setLoadedMethods(methods);
        });
        getRecipe(method, loadedID).then((recipe) => {
          if (recipe) {
            setLoadedRecipe(recipe);
          } else {
            console.log("No data available");
          }
        });
      }
     return () =>{gettingData=false}
    }, [])
  );

  function EditInputWindow(props) {
    useEffect(() => {
      props.dataObject[props.itemKey] = {
        variableValue: varState,
        order: props.itemValue.order,
      };
    });
  
    const [varState, setVarState] = useState(
      String(props.itemValue.variableValue)
    );
    return (
      <TextInput
      multiline={true}
        style={styles.inputEdit}
        placeholder={props.itemKey}
        value={varState}
        onChangeText={setVarState}
        onEndEditing={() =>
          (props.dataObject[props.itemKey] = {
            variableValue: varState,
            order: props.itemValue.order,
          })
        }
      />
    );
  }

  const editDisplay = Object.entries(loadedRecipe)
    .sort(([akey, avalue], [bkey, bvalue]) => avalue.order - bvalue.order)
    .filter(
      ([key, value]) =>
        key != "order" &&
        key != "method" &&
        key != "favorite" &&
        key != "backgroundColor" 
        // && value.visible===true
    )
    .map(([key, value], index) => (
      <View
        key={index}
        style={{ width: "100%", marginBottom: 5 }}
      >
        <Text style={{color:"#f47920", paddingBottom: 3, fontFamily: "Raleway-Bold", textAlign: "left" }}>
          {key}
        </Text>
        <EditInputWindow
          key={index}
          itemKey={key}
          itemValue={value}
          dataObject={dataObject}
        />
      </View>
    ));

  function updateEntry() {
    updateRecipe(method, loadedID, dataObject);
    alert("Updated!");
    navigation.goBack();
    reset();
  }

  function addVariableToRecipe(variableName, orderCount) {
    updateRecipe(method, loadedID, {
      [variableName]: { variableValue: "", order: orderCount },
    });
    alert("Added!");
    reset();
  }

  function reset() {
    getRecipe(method, loadedID).then((recipe) => {
      if (recipe) {
        setLoadedRecipe(recipe);
      } else {
        console.log("No data available");
      }
    });
  }

  const pickerMethodList = Object.values(loadedMethods)
    .sort((a, b) => a.order - b.order)
    .filter((item) => item != "Favorites" && item != "Recent" && item.visible===true)
    .map((item, index) => (
      <Picker.Item
        key={index}
        label={item.methodName}
        value={item.methodName}
      />
    ));

  const pickerDisplay = (
    <Picker
      style={styles.picker}
      selectedValue={method}
      onValueChange={(itemValue, itemIndex) => {
        setMethod(itemValue), (dataObject.method = itemValue);
      }}
    >
      <Picker.Item
        color="gray"
        enabled={false}
        label="Select Brewing Method"
        value=""
      />
      {pickerMethodList}
    </Picker>
  );
  

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ alignItems: "center" }}
    >
      {pickerDisplay}
      <View style={{alignItems:"center", width:"90%"}}>
      {editDisplay}
      </View>
      <Text style={{ fontFamily: "Raleway-Bold" }}>Add New Variable</Text>
      <NewVariableInput
        addVariableToRecipe={addVariableToRecipe}
        method={method}
        loadedID={loadedID}
        navigation={navigation}
        setLoading={setLoading}
        loading={loading}
      />

      <TouchableOpacity
        style={{ marginTop: 10, marginBottom: 10 }}
        onPress={() =>
          navigation.navigate("Edit Single Recipe", {
            method: method,
            loadedRecipe: loadedRecipe,
            loadedID: loadedID,
          })
        }
      >
        <Text style={styles.modalButtonText}>Reorder this recipe</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => updateEntry()}
      >
        <Text style={styles.modalButtonText}>Save Edits</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
