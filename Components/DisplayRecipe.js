import {
  ScrollView,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

export function DisplayRecipe({ route, navigation }) {
  const loadedID = route.params.loadedID;
  const [loadedRecipe, setLoadedRecipe] = useState({});
  const [loadedMethods, setLoadedMethods] = useState("");
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
      await database()
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

      await database()
        .ref(`/users/${user.uid}/recipes/${loadedMethod}/${loadedID}/`)
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
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  async function addRemoveStar() {
    loadedRecipe.favorite == true
      ? (loadedRecipe.favorite = false)
      : (loadedRecipe.favorite = true);
    try {
      await database()
        .ref(`/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}/`)
        .update({
          favorite: loadedRecipe.favorite,
        });
    } catch (e) {
      console.warn(e);
    } finally {
      alert(
        loadedRecipe.favorite == true
          ? "Added to favorites"
          : "Removed from favorites"
      ),
        setUpdated(!updated);
    }
  }

  function selectVariable(key, value) {
    setEditing(true);
    setActiveEdit(key);
    setEditValue(value);
  }

  function unSelect(key, value) {
    database()
      .ref(
        `/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}/${key}/`
      )
      .update({ variableValue: editValue });
    setEditing(false);
    setActiveEdit(null);
    setEditValue("");
  }

  const user = auth().currentUser;

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
        <KeyboardAvoidingView key={index}>
          <TextInput
            autoFocus={true}
            style={[styles.input, { width: "100%", paddingLeft: 10 }]}
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
          <Text style={{ fontFamily: "Raleway-Bold", paddingLeft: 10 }}>
            {key}
          </Text>
          <Text style={{ paddingLeft: 10, fontFamily: "Raleway-Medium" }}>
            {value.variableValue}
          </Text>
        </TouchableOpacity>
      )
    );

  function deleteAlert(endpoint) {
    Alert.alert(
      `Delete-O-Matic`,
      `Are you sure? This will permanently delete "${loadedRecipe["Recipe Name"].variableValue}".`,
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
      .then(() => navigation.goBack());
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
        <Text style={[styles.entryHeadline, { textAlign: "center" }]}>
          {route.params.loadedRecipe["Recipe Name"].variableValue}
        </Text>
        {editDisplay}
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
            onPress={() =>
              deleteAlert(
                `/users/${user.uid}/recipes/${loadedRecipe.method}/${loadedID}/`
              )
            }
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
