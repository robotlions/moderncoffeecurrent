import {
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

import DraggableFlatList from "react-native-draggable-flatlist";

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
    <KeyboardAvoidingView>
      <TextInput
        style={[
          styles.input,
          {
            width: "100%",
            paddingLeft: 10,
            backgroundColor: "white",
            borderColor: "white",
            textAlign: "center",
          },
        ]}
        placeholder="Add new variable here"
        value={thisState}
        onChangeText={setThisState}
      ></TextInput>
      {thisState != "" ? (
        <TouchableOpacity
          style={{ paddingBottom: 10, paddingTop: 10 }}
          onPress={() => {
            props.pushNewVariable(
              { variableName: thisState, order: orderCount },
              props.endpoint,
              props.navigation
            ),
              setThisState("");
            props.setLoading(!props.loading);
          }}
        >
          <Text
            style={[
              styles.modalButtonText,
              { textAlign: "center", fontSize: 20, paddingBottom: 20 },
            ]}
          >
            Save New Variable
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={[styles.inactiveButton, { paddingBottom: 20 }]}></Text>
      )}
    </KeyboardAvoidingView>
  );
};

export function RecipeTemplate({ route, navigation }) {
  const user = auth().currentUser;
  const [loadedVariables, setLoadedVariables] = useState({});
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
        };
      });
    setData(initialData);
  }, [loadedVariables]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (active == true) {
        database()
          .ref(`/users/${user.uid}/variables/`)
          .once("value")
          .then((snapshot) => {
            if (snapshot.exists()) {
              setLoadedVariables(snapshot.val());
            }
          });
      }
      return () => {
        active = false;
      };
    }, [loading])
  );

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity onLongPress={drag} disabled={isActive}>
        <View style={{ flex: 1 }}>
          <View style={styles.variableEntry}>
            <Text style={styles.variableText}>{item.label}</Text>
            {item.label != "Recipe Name" && item.label != "Description" && (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() =>
                  deleteAlert(`/users/${user.uid}/variables/${item.id}`)
                }
              >
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  function setIndices(data) {
    data.forEach((item, index) => {
      database()
        .ref(`/users/${user.uid}/variables/${item.id}/`)
        .update({ order: index });
    });
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
    database().ref(endpoint).remove();
    setLoading(!loading);
  }

  function pushNewVariable(dataObject, endpoint, navigation) {
    database().ref(endpoint).push(dataObject);
    alert("Added!");
    setLoading(!loading);
  }

  return (
    <DraggableFlatList
      keyboardShouldPersistTaps="handled"
      data={data}
      onDragEnd={({ data }) => {
        setData(data), setIndices(data);
      }}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={() => (
        <Text
          style={[
            styles.entryHeadline,
            { textAlign: "center", marginBottom: 5 },
          ]}
        >
          Drag to reorder
        </Text>
      )}
      ListFooterComponent={() => (
        <NewVariableInput
          pushNewVariable={pushNewVariable}
          endpoint={`/users/${user.uid}/variables/`}
          user={user}
          navigation={navigation}
          setLoading={setLoading}
          loading={loading}
        />
      )}
    />
  );
}
