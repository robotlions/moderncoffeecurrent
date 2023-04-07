import {
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

import DraggableFlatList from "react-native-draggable-flatlist";
import CheckBox from "@react-native-community/checkbox";


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
              {
                variableName: thisState,
                order: orderCount,
                userAdded: true,
                visible: true,
              },
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
  const [screenLoaded, setScreenLoaded] = useState(false);

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
          userAdded: item[1].userAdded,
          visible: item[1].visible,
        };
      });
    setData(initialData);
  }, [loadedVariables]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (active == true) {
        fetchAndLoadData();
      }
      return () => {
        active = false;
      };
    }, [loading])
  );

  async function fetchAndLoadData() {
    try {
      await database()
        .ref(`/users/${user.uid}/variables/`)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            setLoadedVariables(snapshot.val());
          }
        });
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  function updateVisible(item, newValue) {
    database()
      .ref(`/users/${user.uid}/variables/${item.id}/`)
      .update({ visible: newValue });
  }

  const renderItem = ({ item, drag, isActive }) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(item.visible);

    return (
      <TouchableOpacity onLongPress={drag} disabled={isActive}>
        <View style={{ flex: 1 }}>
          <View style={styles.variableEntry}>
            <Text style={styles.variableText}>{item.label}</Text>
            {item.label != "Recipe Name" && item.label != "Description" && (
              item.userAdded===true ?
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() =>
                  deleteAlert(`/users/${user.uid}/variables/${item.id}`)
                }
              >
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
              :
              <CheckBox
              disabled={false}
              tintColors={{ true: "#fd7908" }}
              value={toggleCheckBox}
              onValueChange={(newValue) => {
                setToggleCheckBox(newValue);
                updateVisible(item, newValue);
              }}
            />
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

  if (screenLoaded === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (screenLoaded === true) {
    return (
      <DraggableFlatList
        keyboardShouldPersistTaps="handled"
        data={data}
        onDragEnd={({ data }) => {
          setData(data), setIndices(data);
        }}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        ListHeaderComponent={() => (<View>
          <Text
            style={[
              styles.entryHeadline,
              { textAlign: "center", marginBottom: 5 },
            ]}
          >
            Drag to reorder
          </Text>
          <Text style={[styles.buttonTextStyle, {textAlign: "center", alignSelf:"flex-end", marginRight: 5, color:"#f47908"}]}>Uncheck{"\n"}to hide</Text>
          </View>
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
}
