import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { styles } from "./Styles";
import stopicon from "../assets/images/stopicon.png";
import playicon from "../assets/images/playicon.png";
import pauseicon from "../assets/images/pauseicon.png";
import { useKeepAwake } from "expo-keep-awake";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { alarmObjects } from "../Data/Models";
import { CheckBox, RadioButton, RadioGroup } from "react-native-radio-check";
import { useFocusEffect } from "@react-navigation/native";

export function StandaloneTimer({ route, navigation }) {
  useKeepAwake();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [timerCounting, setTimerCounting] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [paused, setPaused] = useState(true);
  const [minPlace, setMinPlace] = useState("Minutes");
  const [secPlace, setSecPlace] = useState("Seconds");
  const [loading, setLoading] = useState(true);
  const [selectedAlarm, setSelectedAlarm] = useState("alarm.wav");
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [checkedIndex, setCheckedIndex] = useState(0);
  const [demoSound, setDemoSound] = useState("");

  var Sound = require("react-native-sound");
  var alarmSound = new Sound(selectedAlarm);

  useEffect(() => {
    alarmSound = new Sound(selectedAlarm);
  }, [selectedAlarm]);

  useFocusEffect(
    useCallback(() => {
   
      checkLocalStorageForAlarmName();
     
      console.log("focus effect")
    
    },[navigation]));

  async function checkLocalStorageForAlarmName() {
    try {
      await AsyncStorage.getItem("modern_coffee_alarm_name").then((value) => {
        let obj = alarmObjects.find((o) => o.url === value);

        if (value !== null) {
          setSelectedAlarm(value);
          setCheckedIndex(obj.indexValue);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  function playDemoSound(value) {
    setDemoSound(value);
    const demoAlarm = new Sound(value, undefined, (error) => {
      if (error) {
        console.log(error);
      } else {
        demoAlarm.play(() => {
          // Release when it's done so we're not using up resources
          demoAlarm.release();
        });
        setTimeout(() => {
          demoAlarm.stop();
        }, 2000);
      }
    });
  }

  const radioMenu = (
    <RadioGroup
      style={{ flexDirection: "column", marginTop: 10, alignItems:"center" }}
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
    try {
      await AsyncStorage.setItem("modern_coffee_alarm_name", demoSound);
    } catch (e) {
      // saving error
    } finally {
      setSelectedAlarm(demoSound);
      console.log(demoSound);
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
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setAlarmModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  function playSound() {
    alarmSound.setNumberOfLoops(3);
    alarmSound.play((success) => {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
      }
    });
  }

  function timerDoneAlert() {
    Alert.alert(
      `Timer-o-Matic 3000`,
      "Timer finished!",
      [
        {
          text: `Stop`,
          onPress: () => alarmSound.stop(),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  useEffect(() => {
    let interval = null;
    let min = minutes;
    let ms = seconds || 60;
    if (timerCounting == true) {
      setPaused(false);
      interval = setInterval(() => {
        ms--;
        if (ms == 59) {
          min--;
          setMinutes(min);
        }
        if (ms == 0) {
          if (min == 0) {
            return (
              // alert("timer done!"),
              timerDoneAlert(),
              playSound(),
              resetButton(),
              setTimerModalVisible(false)
            );
          }
          ms = 59;
          min--;
          setMinutes(min);
        }

        setSeconds(ms);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timerCounting]);

  function resetButton() {
    setSeconds(0);
    setMinutes(0);
    setPaused(true);
    setInputMinutes("");
    setInputSeconds("");
    setTimerCounting(false);
  }

  function pauseButton() {
    if (inputSeconds != "") {
      setSeconds(parseInt(inputSeconds));
      setInputSeconds("");
    }
    if (inputMinutes != "") {
      setMinutes(parseInt(inputMinutes));
      setInputMinutes("");
    }

    if (
      minutes == 0 &&
      seconds == 0 &&
      inputSeconds == 0 &&
      inputMinutes == 0
    ) {
      alert("Please set the timer first");
    } else {
      setTimerCounting(!timerCounting);
      setPaused(!paused);
    }
  }

  const minutesInput = (
    <TextInput
      keyboardType="numeric"
      style={[styles.timerInput, { width: "30%", textAlign: "center"}]}
      value={inputMinutes}
      onChangeText={setInputMinutes}
      onEndEditing={() => {
        parseInt(inputMinutes) > 0 && setMinutes(parseInt(inputMinutes) || 0),
          setInputMinutes("");
      }}
      onFocus={() => setMinPlace("")}
      onBlur={() => setMinPlace("Minutes")}
      placeholder={minPlace}
    ></TextInput>
  );
  const secondsInput = (
    <TextInput
      keyboardType="numeric"
      style={[styles.timerInput, { width: "30%", textAlign: "center"}]}
      value={inputSeconds}
      onChangeText={setInputSeconds}
      onEndEditing={() => {
        parseInt(inputSeconds) > 0 && setSeconds(parseInt(inputSeconds) || 0),
          setInputSeconds("");
      }}
      onFocus={() => setSecPlace("")}
      onBlur={() => setSecPlace("Seconds")}
      placeholder={secPlace}
    ></TextInput>
  );

  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <TouchableOpacity
        onPress={() => setTimerModalVisible(false)}
      ></TouchableOpacity>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </Text>
        {!timerCounting && (
          <View 
          style={{flexDirection: "row", marginBottom: "15%" }}
          >
            {minutesInput}
            {secondsInput}
          </View>
        )}

        <Text>
          <TouchableOpacity onPress={() => pauseButton()}>
            <Image
              style={[styles.timerIcons, { marginLeft: 5, marginRight: 5 }]}
              source={paused ? playicon : pauseicon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => resetButton()}>
            <Image
              source={stopicon}
              style={[styles.timerIcons, { marginLeft: 5, marginRight: 5 }]}
            />
          </TouchableOpacity>
        </Text>
        {/* {alarmSelectModal} */}
      </View>
      
    </View>
  );
}
