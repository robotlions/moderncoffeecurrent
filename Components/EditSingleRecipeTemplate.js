import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

import DraggableFlatList from "react-native-draggable-flatlist";

export function EditSingleRecipeTemplate({ route, navigation }) {
  const user = auth().currentUser;

  const loadedID = route.params.loadedID;
  const [loadedRecipe, setLoadedRecipe] = useState({
    ...route.params.loadedRecipe,
  });
  const [method, setMethod] = useState(route.params.loadedRecipe.method);
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let loading = true;
      if (loading === true) {
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

  useEffect(() => {
    let initialData = Object.entries(loadedRecipe)
      .filter(
        (item) =>
          item[0] != "order" &&
          item[0] != "favorite" &&
          item[0] != "method" &&
          item[0] != "backgroundColor"
      )
      .sort((a, b) => a[1].order - b[1].order)
      .map((item, index) => {
        return {
          id: item[0],
          key: `item-${index}`,
          label: item[1].variableValue,
          order: item[1].order,
        };
      });
    setData(initialData);
  }, [loadedRecipe]);

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

  const flatlistHeader = (
    <>
      <Text
        style={{
          fontFamily: "Raleway-Bold",
          fontSize: 22,
          marginBottom: 10,
          textAlign: "center",
          color: "#f47920",
        }}
      >
        {route.params.loadedRecipe["Recipe Name"].variableValue}
      </Text>
      <Text
        style={[
          styles.modalButtonText,
          { textAlign: "center", marginBottom: 20, color: "black" },
        ]}
      >
        Drag to reorder
      </Text>
    </>
  );

  const flatlistFooter = (
    <>
      <Text style={{ textAlign: "center", marginBottom: 20 }}>
        <TouchableOpacity
          style={{ textAlign: "center", marginTop: 10, marginBottom: 10 }}
          onPress={() => [reset(), navigation.goBack()]}
        >
          <Text style={[styles.modalButtonText, { fontSize: 20 }]}>
            Save Edits
          </Text>
        </TouchableOpacity>
      </Text>
    </>
  );

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.varibleEntrySingleRecipe}
          onLongPress={drag}
          disabled={isActive}
        >
          <View>
            <Text
              style={{
                fontFamily: "Raleway-Bold",
                fontSize: 16,
                color: "#f47920",
              }}
            >
              {item.id}
            </Text>
            <Text style={{ fontFamily: "Raleway-Medium", paddingRight: 100 }}>
              {item.label}
            </Text>
          </View>
          {item.id != "Recipe Name" && item.id != "Description" && (
            <TouchableOpacity
              onPress={() =>
                deleteAlert(
                  `/users/${user.uid}/recipes/${method}/${loadedID}/${item.id}`
                )
              }
            >
              <Text style={styles.deleteButtonEditSingleRecipe}>Delete</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

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
    database().ref(endpoint).remove();
    reset();
    // .then(() => props.navigation.goBack());
  }

  function setIndices(data) {
    data.forEach((item, index) => {
      database()
        .ref(`/users/${user.uid}/recipes/${method}/${loadedID}/${item.id}/`)
        .update({ order: index });
      // console.log(item.id)
    });
  }

  return (
    <>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => {
          setData(data), setIndices(data);
        }}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        ListHeaderComponent={flatlistHeader}
        ListFooterComponent={flatlistFooter}
      />
    </>
  );
}
