import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const NewVariableInput = (props) => {
  database()
    .ref(props.endpoint)
    .once("value")
    .then((snapshot) => {
      setOrderCount(snapshot.numChildren() + 1);
    });

  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0);

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
            props.pushNewVariable(
              { variableValue: "", order: orderCount },
              `${props.endpoint}/${thisState}/`,
              props.navigation
            ),
              setThisState(""),
              props.setLoading(true);
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
      style={styles.input}
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
      let loading = true;
      if (loading === true) {
        dataObject = route.params.loadedRecipe;
        database()
          .ref(`/users/${user.uid}/methods/`)
          .once("value")
          .then((snapshot) => {
            if (snapshot.exists()) {
              setLoadedMethods(snapshot.val());
            } else {
              console.log("No data available");
            }
          })

          .catch((error) => {
            console.error(error);
          });
        database()
          .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
          .once("value")
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
      return () => {
        loading = false;
      };
    }, [])
  );

  const user = auth().currentUser;

  const editDisplay = Object.entries(loadedRecipe)
    .sort(([akey, avalue], [bkey, bvalue]) => avalue.order - bvalue.order)
    .filter(
      ([key, value]) =>
        key != "order" &&
        key != "method" &&
        key != "favorite" &&
        key != "backgroundColor"
    )
    .map(([key, value], index) => (
      <View
        key={index}
        style={{ width: "100%", alignItems: "center", marginBottom: 5 }}
      >
        <Text style={{ fontFamily: "Raleway-Bold", textAlign: "left" }}>
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
    database()
      .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
      .update(dataObject),
      alert("Updated!");
    navigation.goBack();
    reset();
  }

  function pushNewVariable(dataObject, endpoint, navigation) {
    database().ref(endpoint).set(dataObject), alert("Added!");
    reset();
  }

  function reset() {
    database()
      .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/`)
      .once("value")
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

  const pickerMethodList = Object.values(loadedMethods)
    .sort((a, b) => a.order - b.order)
    .filter((item) => item != "Favorites" && item != "Recent")
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
      {editDisplay}
      <Text style={{ fontFamily: "Raleway-Bold" }}>Add New Variable</Text>
      <NewVariableInput
        pushNewVariable={pushNewVariable}
        endpoint={`/users/${user.uid}/recipes/${method}/${loadedID}`}
        user={user}
        navigation={navigation}
        setLoading={setLoading}
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
        <Text style={styles.modalButtonText}>Customize This Recipe</Text>
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
