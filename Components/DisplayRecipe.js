import {
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import { useFocusEffect } from "@react-navigation/native";
import appBanner from "../assets/images/banners/appBanner600x400.png";
import { getRecipe, removeRecipe, updateRecipe } from "../Data/Storage";

export function DisplayRecipe({ route, navigation }) {
  const loadedID = route.params.loadedID;
  const [loadedRecipe, setLoadedRecipe] = useState({});
  const [loadedMethod, setLoadedMethod] = useState(route.params.loadedMethod);
  const [editing, setEditing] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [updated, setUpdated] = useState(false);
  const [screenLoaded, setScreenLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let loading = true;
      if (loading === true) {
        fetchAndLoadData();
      }
      return () => {
        loading = false;
      };
    }, [editing, updated])
  );

  async function fetchAndLoadData() {
    try {
      const recipe = await getRecipe(loadedMethod, loadedID);
      if (recipe) {
        setLoadedRecipe(recipe);
      } else {
        console.log("No data available");
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  function addRemoveStar() {
    loadedRecipe.favorite == true
      ? (loadedRecipe.favorite = false)
      : (loadedRecipe.favorite = true);
    updateRecipe(loadedRecipe.method, loadedID, {
      favorite: loadedRecipe.favorite,
    });

    Alert.alert(
      `${loadedRecipe["Recipe Name"].variableValue}`,
      loadedRecipe.favorite===false ? "Removed from favorites." : "Added to favorites.",
        [{ text: "Ok", style: "cancel" }],
        { cancelable: true }
      ),
      setUpdated(!updated);
  }


  function selectVariable(key, value) {
    setEditing(true);
    setActiveEdit(key);
    setEditValue(value);
  }

  function unSelect(key, value) {
    updateRecipe(loadedRecipe.method, loadedID, {
      [key]: { variableValue: editValue, order: value.order },
    });
    setEditing(false);
    setActiveEdit(null);
    setEditValue("");
  }

  const editDisplay = Object.entries(loadedRecipe)
    .sort(([akey, avalue], [bkey, bvalue]) => avalue.order - bvalue.order)
    .filter(
      ([key, value]) =>
        key != "favorite" &&
        key != "method" &&
        key != "order" &&
        key != "backgroundColor"
    )
    .map(([key, value], index) =>
      editing == true && activeEdit == key ? (
        <KeyboardAvoidingView style={{width:"100%", alignItems:"center"}} key={index}>
          <TextInput
            autoFocus={true}
            style={[styles.input, {width:"90%"}]}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={key}
          />

          <TouchableOpacity onPress={() => unSelect(key, value)}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Raleway-Medium",
                color: "green",
                fontSize: 20,
                paddingBottom: 10,
              }}
            >
              DONE
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      ) : (
        <TouchableOpacity
          onLongPress={() => selectVariable(key, value.variableValue)}
          style={styles.recipeVariableTouchable}
          key={index}
        >
          <Text style={{ fontFamily: "Raleway-Bold", paddingLeft: 10, color:"#f47920" }}>
            {key}
          </Text>
          <Text style={{ paddingLeft: 10, paddingRight: 10,fontFamily: "Raleway-Medium" }}>
            {value.variableValue}
          </Text>
        </TouchableOpacity>
      )
    );

  function deleteAlert() {
    Alert.alert(
      `Delete-O-Matic`,
      `Are you sure? This will permanently delete "${loadedRecipe["Recipe Name"].variableValue}".`,
      [
        {
          text: `Delete`,
          onPress: () => deleteSelected(),
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

  function deleteSelected() {
    removeRecipe(loadedRecipe.method, loadedID);
    navigation.goBack();
  }

  if (screenLoaded === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  } else {
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <ImageBackground
            resizeMode="cover"
            style={styles.imageBackground}
            source={appBanner}
          >
            <Text style={[styles.methodBannerText, {fontSize:30}]}>{loadedRecipe["Recipe Name"].variableValue}</Text>
          </ImageBackground>
        <View style={{alignItems: "center"}}>
        {editDisplay}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Edit", {
                loadedID: loadedID,
                loadedRecipe: loadedRecipe,
              })
            }
          >
            <Text style={[styles.modalButtonText, { textAlign: "center" }]}>
              Edit Recipe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteAlert()}
          >
            <Text style={[styles.modalButtonText, { textAlign: "center" }]}>
              Delete Recipe
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ marginTop: 10, marginBottom: 10 }}
          onPress={() => addRemoveStar()}
        >
          <Text style={[styles.modalButtonText, { textAlign: "center" }]}>
            {loadedRecipe.favorite == true
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
