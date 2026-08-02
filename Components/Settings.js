import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  ImageBackground,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "./Styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { alarmObjects, alarmSoundSources } from "../Data/Models";
import { CheckBox, RadioButton, RadioGroup } from "react-native-radio-check";
import { createAudioPlayer } from "expo-audio";
import settingsBanner from "../assets/images/banners/settingsBanner600x400.png";
import { resetAllData } from "../Data/Storage";

export function Settings({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [selectedAlarm, setSelectedAlarm] = useState("alarm.wav");
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [checkedIndex, setCheckedIndex] = useState(0);
  const [demoSound, setDemoSound] = useState("");
  const [featuredChecked, setFeaturedChecked] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (loading === true) {
        checkLocalStorageForAlarmName();
        checkLocalStorageForFeatured();
        setLoading(false);
      }
    })
  );

  async function checkLocalStorageForAlarmName() {
    try {
      await AsyncStorage.getItem("modern_coffee_alarm_name").then((value) => {
        if (value !== null) {
          let obj = alarmObjects.find((o) => o.url === value);

          setSelectedAlarm(value);
          if (obj) {
            setCheckedIndex(obj.indexValue);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function updateFeaturedLocalStorage(value) {
    try {
      await AsyncStorage.setItem("modern_coffee_featured", String(value));
    } catch (e) {
      console.error(e);
    }
  }

  async function checkLocalStorageForFeatured() {
    try {
      await AsyncStorage.getItem("modern_coffee_featured").then((value) => {
        if (value !== null) {
          if (value === "true") {
            setFeaturedChecked(true);
          }
          if (value === "false") {
            setFeaturedChecked(false);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  function resetAlert() {
    Alert.alert(
      `Are you sure?`,
      `This will reset the app to its default state and delete all of your recipes, methods, and template changes.`,
      [
        {
          text: `Yes, reset`,
          onPress: () => {
            resetAllData();
            navigation.navigate("Home");
          },
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

  function playDemoSound(value) {
    setDemoSound(value);
    const demoAlarm = createAudioPlayer(alarmSoundSources[value]);
    demoAlarm.play();
    setTimeout(() => {
      demoAlarm.pause();
      demoAlarm.remove();
    }, 2000);
  }

  const radioMenu = (
    <RadioGroup
      style={{ flexDirection: "column", marginTop: 10, alignItems: "center" }}
      checkedId={checkedIndex}
      textStyle={{ marginLeft: 5 }}
      icon={{
        normal: require("../assets/images/radioOff.png"),
        checked: require("../assets/images/radioOn.png"),
      }}
      iconStyle={{ height: 30, width: 30, tintColor: "#fd7908" }}
      onChecked={(id, value) => playDemoSound(value)}
    >
      <RadioButton
        text="Digital Clock Alarm Buzzer"
        value="digitalclockalarmbuzzer.wav"
      />
      <RadioButton text="Warning Alarm Buzzer" value="warningalarmbuzzer.wav" />
      <RadioButton
        text="Alarm Digital Clock Beep"
        value="alarmdigitalclockbeep.wav"
      />
      <RadioButton text="Classic Winner Alarm" value="classicwinneralarm.wav" />
      <RadioButton text="Morning Clock Alarm" value="morningclockalarm.wav" />
    </RadioGroup>
  );

  async function saveAlarmSound() {
    if (demoSound != "") {
      let obj = alarmObjects.find((o) => o.url === demoSound);

      try {
        await AsyncStorage.setItem("modern_coffee_alarm_name", demoSound);
      } catch (e) {
      } finally {
        setSelectedAlarm(demoSound);
        setCheckedIndex(obj.indexValue);

        console.log(demoSound);
      }
    }
  }

  const alarmSelectModal = (
    <Modal
      visible={alarmModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setAlarmModalVisible(false)}
    >
      <View
        style={{
          paddingTop: 60,
          minHeight: "100%",
          backgroundColor: "rgba(52, 52, 52, 0.7)",
        }}
      >
        <View style={styles.modalView}>
          {radioMenu}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setAlarmModalVisible(false), saveAlarmSound();
              }}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ImageBackground
          resizeMode="cover"
          style={styles.imageBackground}
          source={settingsBanner}
        >
          <Text style={styles.mainTitleText}>Settings</Text>
        </ImageBackground>
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Text style={styles.menuHeading}>Customize</Text>
          <TouchableOpacity
            style={styles.settingsTouchable}
            onPress={() => navigation.navigate("Edit Brew Methods")}
          >
            <Text style={styles.menuTouchable}>Customize Brew Methods</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsTouchable}
            onPress={() => navigation.navigate("Edit Recipe Template")}
          >
            <Text style={styles.menuTouchable}>Customize Recipe Template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsTouchable}
            onPress={() => setAlarmModalVisible(!alarmModalVisible)}
          >
            <Text style={styles.menuTouchable}>Change Alarm Sound</Text>
          </TouchableOpacity>
          <CheckBox
            icon={{
              normal: require("../assets/images/radioOff.png"),
              checked: require("../assets/images/radioOn.png"),
            }}
            iconStyle={{ height: 30, width: 30, tintColor: "#fd7908", marginRight: 10}}
            textStyle={styles.menuTouchable}
            text="Show Featured Recipes" checked={featuredChecked}
            onChecked={(value) => { [setFeaturedChecked(value), updateFeaturedLocalStorage(value)] }} />

          <Text>{"\n"}</Text>
          <Text style={styles.menuHeading}>Data</Text>
          <TouchableOpacity
            style={styles.settingsTouchable}
            onPress={() => resetAlert()}
          >
            <Text style={styles.menuTouchable}>Reset App Data</Text>
          </TouchableOpacity>
          <Text>{"\n"}</Text>
          <Text>{"\n"}</Text>

          <Text style={styles.menuHeading}>About</Text>
          <Text style={{ fontFamily: "Raleway-Medium" }}>
            Modern Coffee ver. 0.90.010124.1{"\n"}
            January 2024{"\n"}© 2024 by Robot Lions{"\n"}
            Contact and feedback: info@robotlions.com
          </Text>
          {alarmSelectModal}
        </View>
      </ScrollView>
    </>
  );
}
