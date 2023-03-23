import {
  Text,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { variableObjects } from "../Data/Models";
import NetInfo from '@react-native-community/netinfo';

function InputWindow(props) {
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {
        setVarState("");
      }
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    props.dataObject[props.item.variableName] = {
      variableValue: varState,
      order: props.item.order,
    };
  });

  const [varState, setVarState] = useState("");

  return (
    <TextInput
      style={styles.input}
      placeholder={props.item.variableName}
      value={varState}
      onChangeText={setVarState}
    />
  );
}

export function CreateRecipe({ route, navigation }) {
  const user = auth().currentUser;
  const [method, setMethod] = useState("");
  const [loadedMethods, setLoadedMethods] = useState({});
  const [order, setOrder] = useState(0);
  const [variableList, setVariableList] = useState([]);
  const [editing, setEditing] = useState(true);
  const [screenLoaded, setScreenLoaded] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(true);

  let dataObject = {};

  

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log("Connection type", state.type);
      setNetworkConnected(state.isConnected);
  
    })
  return unsubscribe;
  },[]);


  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) {
        dataObject = {};
        setMethod(route.params ? route.params.method : "");
      }
      fetchAndLoadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  async function fetchAndLoadData() {
    let varArray = [];

    try {
      await database()
        .ref(`/users/${user.uid}/methods/`)
        .once("value", (snapshot) => {
          if (snapshot.exists()) {
            setLoadedMethods(snapshot.val());
          } else {
            setLoadedMethods({});
          }
        });
      await database()
        .ref(`/users/${user.uid}/variables/`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((baby) => {
              varArray.push(baby.val());
            });
            setVariableList(varArray);
          } else {
            variableObjects.forEach((item) => {
              database().ref(`/users/${user.uid}/variables/`).push(item);
            });
            setTimeout(() => {
              database()
                .ref(`/users/${user.uid}/variables/`)
                .once("value")
                .then((snapshot) => {
                  snapshot.forEach((baby) => {
                    varArray.push(baby.val());
                  });
                  setVariableList(varArray);
                });
            }, 1000);
          }
        });
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  //this useEffect listens for a change to {method}, then reads the database node of that method
  //then sets a variable in state: Order, which is 1 higher than the number of entries in that
  //node
  useEffect(() => {
    database()
      .ref(`/users/${user.uid}/recipes/${method}`)
      .once("value")
      .then((snapshot) => {
        setOrder(snapshot.numChildren() + 1);
      });
  }, [method]);

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

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (editing === false) {
          return;
        }

        e.preventDefault();

        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure to discard them and leave the screen?",
          [
            { text: "Keep working", style: "cancel", onPress: () => {} },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, editing]
  );

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

  const inputDisplay = variableList
    .sort((a, b) => a.order - b.order)
    .map((item, index) => (
      <InputWindow key={index} dataObject={dataObject} item={item} />
    ));

  const colorPalette = {
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
  };

  function doRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getColor() {
    let colorPick = doRandom(1, 11);
    return colorPalette[colorPick];
  }

  async function pushNewEntry() {
    dataObject.backgroundColor = getColor();
    dataObject.method = method;
    dataObject.order = order;

    try {
      setEditing(false);
      if (networkConnected === false) {
        Alert.alert(
          "modern coffee",
          `This device is offline. We'll save your new recipe, "${dataObject["Recipe Name"].variableValue}," locally and automatically update your cloud data when you're connected again. This can take a while after reconnecting.`,
        [{text: "okay", onPress: ()=> navigation.navigate("HomeScreen")} ]);
          // navigation.navigate("HomeScreen");
      }
      await database()
        .ref(`/users/${user.uid}/recipes/${method}`)
        .push()
        .set(dataObject);
    } catch (e) {
      console.warn(e);
    } finally {
      Alert.alert(
        "modern coffee",
        `New recipe "${dataObject["Recipe Name"].variableValue}" added to ${dataObject.method} method.`
      );
      navigation.navigate("HomeScreen");
    }
  }

  if (screenLoaded === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (screenLoaded === true) {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ alignItems: "center" }}
      >
        {pickerDisplay}
        {inputDisplay}
        <TouchableOpacity
          onPress={() =>
            method == ""
              ? Alert.alert(
                  "modern coffee",
                  "Please choose brew method",
                  [{ text: "Ok", style: "cancel" }],
                  { cancelable: true }
                )
              : pushNewEntry()
          }
        >
          <Text
            style={[
              styles.modalButtonText,
              { marginTop: 10, marginBottom: 10, fontSize: 25 },
            ]}
          >
            Save Recipe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            BackHandler.removeEventListener("hardwareBackPress"),
              navigation.goBack();
          }}
        >
          <Text
            style={[
              styles.modalButtonText,
              { marginTop: 10, marginBottom: 10, fontSize: 25 },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
