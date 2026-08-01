import {
  Text,
  TextInput,
  ScrollView,
  Alert,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ImageBackground,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { variableObjects } from "../Data/Models";
import NetInfo from "@react-native-community/netinfo";
import createBanner from "../assets/images/banners/createBanner600x400.png";
import {
  addRecipe,
  getMethods,
  getRecipes,
  getVariables,
} from "../Data/Storage";

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

  let lineCheck = props.item.variableName==="Notes" || props.item.variableName==="Instructions" ? 3 : 1

  return (
    <TextInput
      style={styles.input}
      placeholder={props.item.variableName}
      value={varState}
      onChangeText={setVarState}
      multiline={true}
      numberOfLines={lineCheck}
      textAlignVertical="top"
      placeholderTextColor="#f47920"
    />
  );
}

export function CreateRecipe({ route, navigation }) {
  const [method, setMethod] = useState("");
  const [loadedMethods, setLoadedMethods] = useState({});
  const [order, setOrder] = useState(0);
  const [variableList, setVariableList] = useState([]);
  const [editing, setEditing] = useState(true);
  const [screenLoaded, setScreenLoaded] = useState(false);

  let dataObject = {};


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
      const methods = await getMethods();
      setLoadedMethods(methods);

      let variables = await getVariables();
      if (Object.keys(variables).length === 0) {
        variableObjects.forEach((item) => {
          addVariable(item);
        });
        variables = await getVariables();
      }
      Object.values(variables).forEach((item) => {
        varArray.push(item);
      });
      setVariableList(varArray);
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  //this useEffect listens for a change to {method}, then counts the recipes
  //stored for that method and sets a variable in state: Order, which is 1
  //higher than the number of recipes in that method
  useEffect(() => {
    getRecipes(method).then((recipes) => {
      setOrder(Object.keys(recipes).length + 1);
    });
  }, [method]);

  useFocusEffect(
    useCallback(() => {
      if (editing === true) {
        const backAction = () => {
          Alert.alert(
            "You have unsaved changes.",
            "Would you like to discard this recipe or keep working on it?",
            [
              {
                text: "Keep working",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "Discard",
                onPress: () => {
                  BackHandler.removeEventListener(
                    "bardwareBackPress",
                    backAction
                  ),
                    navigation.goBack();
                },
              },
            ]
          );
          return true;
        };

        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );

        return () => backHandler.remove();
      }
    }, [])
  );

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

  const inputDisplay = variableList
    .sort((a, b) => a.order - b.order)
    .filter((item)=>item.visible===true)
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

  function pushNewEntry() {
    dataObject.backgroundColor = getColor();
    dataObject.method = method;
    dataObject.order = order;
    setEditing(false);
    addRecipe(method, dataObject);

    Alert.alert(
      "modern coffee",
      `New recipe "${dataObject["Recipe Name"].variableValue}" added to ${dataObject.method} method.`
    );
    navigation.navigate("HomeScreen");
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
      <>
      <ImageBackground
            resizeMode="cover"
            style={styles.imageBackground}
            source={createBanner}
          >
            <Text style={styles.mainTitleText}>Create Recipe</Text>
          </ImageBackground>
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
      </>
    );
  }
}
