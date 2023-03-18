import {
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

import DraggableFlatList, {
} from "react-native-draggable-flatlist";

const NewMethodInput = (props) => {
  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [bgColor, setBGColor] = useState(0);
  const [loading, setLoading] = useState(true);

  database()
    .ref(props.endpoint)
    .once("value")
    .then((snapshot) => {
      setOrderCount(snapshot.numChildren() + 1);
    });

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

  if (loading === true) {
    let colorPick = doRandom(1, 11);
    setBGColor(colorPalette[colorPick]);
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView>
      <TextInput
        style={[styles.input, { width: "100%", textAlign: "center" }]}
        placeholder="Input new brewing method"
        value={thisState}
        onChangeText={setThisState}
      ></TextInput>
      {thisState != "" ? (
        <TouchableOpacity
          onPress={() => {
            pushNewVariable(
              {
                methodName: thisState,
                order: orderCount,
                backgroundColor: bgColor,
              },
              props.endpoint,
              props.navigation
            ),
              setThisState(""),
              props.setLoading(true);
          }}
        >
          <Text
            style={[
              styles.modalButtonText,
              { textAlign: "center", paddingBottom: 20 },
            ]}
          >
            Save New Method
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={[styles.inactiveButton, { paddingBottom: 20 }]}></Text>
      )}
    </KeyboardAvoidingView>
  );
};

function pushNewVariable(dataObject, endpoint, navigation) {
  database().ref(endpoint).push(dataObject), alert("Added!");
}

export function BrewMethods({ route, navigation }) {
  const user = auth().currentUser;
  const [loadedMethods, setLoadedMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [editInput, setEditInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    let initialData = Object.entries(loadedMethods)
      .sort((a, b) => a[1].order - b[1].order)
      .map((item, index) => {
        return {
          id: item[0],
          key: `item-${index}`,
          label: item[1].methodName,
          order: item[1].order,
          height: 100,
        };
      });
    setData(initialData);
  }, [loadedMethods]);

  function getData() {
    database()
      .ref(`/users/${user.uid}/methods/`)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          setLoadedMethods(snapshot.val());
        } else {
          setLoadedMethods({});
          console.log("No data available");
        }
      })

      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (loading === true) {
      getData();
      setLoading(false);
    }
  });

  function reset() {
    setLoading(true);
  }

  function deleteAlert(endpoint) {
    Alert.alert(
      `Delete-O-Matic`,
      `Are you sure? This will permanently remove this method and all of its receipes.`,
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
  }

  function editMethodName(methodName) {
    setEditInput(methodName);
    setEditing(!editing);
    setActiveEdit(methodName);
  }

  function updateMethodName(endpoint) {
    database()
      .ref(`/users/${user.uid}/methods/${endpoint}`)
      .update({ methodName: editInput });
    setEditing(false);
    setEditInput("");
    setActiveEdit(null);
    reset();
  }

  function setIndices(data) {
    data.forEach((item, index) => {
      database()
        .ref(`/users/${user.uid}/methods/${item.id}/`)
        .update({ order: index });
    });
  }

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity onLongPress={drag} disabled={isActive}>
        <View style={styles.variableEntry}>
          {editing === true && activeEdit === item.label ? (
            <TextInput
              autoFocus={true}
              style={[
                styles.input,
                {
                  width: "50%",
                  borderWidth: 0,
                  marginTop: 2,
                  backgroundColor: "transparent",
                },
              ]}
              value={editInput}
              onChangeText={setEditInput}
            ></TextInput>
          ) : (
            <Text style={styles.variableText}>{item.label}</Text>
          )}
          <Text>
            {editing === true && activeEdit === item.label ? (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => updateMethodName(item.id)}
              >
                <Text
                  style={[
                    styles.buttonTextStyle,
                    { marginRight: 20, color: "green" },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => editMethodName(item.label)}
              >
                <Text
                  style={[
                    styles.buttonTextStyle,
                    { marginRight: 20, color: "#fd7908" },
                  ]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() =>
                deleteAlert(`/users/${user.uid}/methods/${item.id}`)
              }
            >
              <Text style={styles.buttonTextStyle}>Delete</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <NewMethodInput
          endpoint={`/users/${user.uid}/methods/`}
          user={user}
          navigation={navigation}
          setLoading={setLoading}
        />
      )}
    />
  );
}
