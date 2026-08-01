import {
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./Styles";
import DraggableFlatList from "react-native-draggable-flatlist";
import CheckBox from "expo-checkbox";
import {
  addMethod,
  getMethods,
  removeAllRecipes,
  removeMethod,
  updateMethod,
} from "../Data/Storage";

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

const NewMethodInput = (props) => {
  const [thisState, setThisState] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [bgColor, setBGColor] = useState("#A67C83");

  useEffect(() => {
    getMethods().then((methods) => {
      setOrderCount(Object.keys(methods).length + 1);
    });
  }, []);

  useEffect(() => {
    let colorPick = doRandom(1, 11);
    setBGColor(colorPalette[colorPick]);
  }, []);

  return (
    <KeyboardAvoidingView>
      <TextInput
        maxLength={20}
        style={[styles.input, { width: "100%", textAlign: "center" }]}
        placeholder="Input new brewing method"
        value={thisState}
        onChangeText={setThisState}
      ></TextInput>
      {thisState != "" ? (
        <TouchableOpacity
          onPress={() => {
            pushNewMethod(
              {
                methodName: thisState,
                order: orderCount,
                backgroundColor: bgColor,
                visible: true,
                userAdded: true,
                iconUrl: require("../assets/images/icons/featuredIconWhite200x200.png"),
                bannerUrl: require("../assets/images/banners/dripBanner400x300.png"),
              },
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

function pushNewMethod(dataObject, navigation) {
  addMethod(dataObject);
  Alert.alert(
    "modern coffee",
    `Brew method "${dataObject.methodName}" added.`,
    [{ text: "ok", style: "cancel" }],
    { cancelable: true }
  );
}

export function BrewMethods({ route, navigation }) {
  const [loadedMethods, setLoadedMethods] = useState({});
  const [loading, setLoading] = useState(true);
  const [editInput, setEditInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [data, setData] = useState([]);
  const [screenLoaded, setScreenLoaded] = useState(false);

  useEffect(() => {
    let initialData = Object.entries(loadedMethods)
      .sort((a, b) => a[1].order - b[1].order)
      .map((item, index) => {
        return {
          id: item[0],
          key: `item-${index}`,
          label: item[1].methodName,
          order: item[1].order,
          userAdded: item[1].userAdded,
          visible: item[1].visible,
          height: 100,
        };
      });
    setData(initialData);
  }, [loadedMethods]);

  async function fetchAndLoadData() {
    try {
      const methods = await getMethods();
      setLoadedMethods(methods);
    } catch (e) {
      console.warn(e);
    } finally {
      setScreenLoaded(true);
    }
  }

  useEffect(() => {
    if (loading === true) {
      fetchAndLoadData();
      setLoading(false);
    }
  });

  function reset() {
    setLoading(true);
  }

  function deleteAlert(id, methodName) {
    Alert.alert(
      `Delete-O-Matic`,
      `Are you sure? This will permanently remove this method and all of its receipes.`,
      [
        {
          text: `Delete`,
          onPress: () => deleteSelected(id, methodName),
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

  function deleteSelected(id, methodName) {
    getMethods().then((methods) => {
      if (Object.keys(methods).length <= 1) {
        Alert.alert(
          "modern coffee",
          "The app can't function without brew methods. Resetting!",
          [{ text: "Okay. I tried.", style: "cancel" }],
          { cancelable: true }
        );
        removeMethod(id);
        removeAllRecipes(methodName);
        navigation.navigate("HomeScreen");
      } else {
        removeMethod(id);
        removeAllRecipes(methodName);
      }
      reset();
    });
  }

  function editMethodName(methodName) {
    setEditInput(methodName);
    setEditing(!editing);
    setActiveEdit(methodName);
  }

  function updateMethodName(id) {
    updateMethod(id, { methodName: editInput });
    setEditing(false);
    setEditInput("");
    setActiveEdit(null);
    reset();
  }

  function setIndices(data) {
    data.forEach((item, index) => {
      updateMethod(item.id, { order: index });
    });
  }

  function updateVisible(item, newValue) {
    updateMethod(item.id, { visible: newValue });
  }

  const renderItem = ({ item, drag, isActive }) => {
    const [toggleCheckBox, setToggleCheckBox] = useState(item.visible);

    return item.userAdded === true ? (
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
              onPress={() => deleteAlert(item.id, item.label)}
            >
              <Text style={styles.buttonTextStyle}>Delete</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onLongPress={drag} disabled={isActive}>
        <View style={styles.variableEntry}>
          <Text style={styles.variableText}>{item.label}</Text>
            <CheckBox
              disabled={false}
              color={"#fd7908"}
              value={toggleCheckBox}
              onValueChange={(newValue) => {
                setToggleCheckBox(newValue);
                updateVisible(item, newValue);
              }}
            />
        </View>
      </TouchableOpacity>
    );
  };

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
          <NewMethodInput
            navigation={navigation}
            setLoading={setLoading}
          />
        )}
      />
    );
  }
}
