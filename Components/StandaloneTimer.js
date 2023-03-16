import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./Styles";
import stopicon from "../assets/images/stopicon.png";
import playicon from "../assets/images/playicon.png";
import pauseicon from "../assets/images/pauseicon.png";
import { useKeepAwake } from "expo-keep-awake";

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

  var Sound = require("react-native-sound");
  var alarmSound = new Sound("alarm.mp3");

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

    if (minutes == 0 && seconds == 0) {
      alert("Please set the timer first");
    } else {
      setTimerCounting(!timerCounting);
      setPaused(!paused);
    }
  }

  const minutesInput = (
    <TextInput
      keyboardType="numeric"
      style={[styles.input, { width: "30%", textAlign: "center" }]}
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
      style={[styles.input, { width: "30%", textAlign: "center" }]}
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
          <View style={{ flex: 1, flexDirection: "row", marginBottom: "15%" }}>
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
      </View>
    </View>
  );
}
