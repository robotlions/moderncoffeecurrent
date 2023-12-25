import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { alarmObjects } from "../Data/Models";
import { CheckBox, RadioButton, RadioGroup } from "react-native-radio-check";
import settingsBanner from "../assets/images/banners/settingsBanner600x400.png";


export function Settings({ route, navigation }) {
  const [password, setPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [email, setEmail] = useState("");
  const [passModalVisible, setPassModalVisible] = useState(false);
  const [changeDisplayNameModuleVisible, setChangeDisplayNameModuleVisble] =
    useState(false);
  const [deleteAccountModuleVisible, setDeleteAccountModuleVisible] =
    useState(false);
    const [loading, setLoading] = useState(true);
  const [selectedAlarm, setSelectedAlarm] = useState("alarm.wav");
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [checkedIndex, setCheckedIndex] = useState(0);
  const [demoSound, setDemoSound] = useState("");


  const user = auth().currentUser;

  var Sound = require("react-native-sound");

  useEffect(() => {
    if (loading === true) {
      checkLocalStorageForAlarmName();
      setLoading(false);
    }
  });

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

  const changePasswordModule = (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        value={newPassword1}
        onChangeText={setNewPassword1}
        style={styles.input}
        secureTextEntry={true}
        placeholder="New Password"
      />
      <TextInput
        value={newPassword2}
        onChangeText={setNewPassword2}
        secureTextEntry={true}
        style={styles.input}
        placeholder="Re-enter New Password"
      />

      <TouchableOpacity onPress={() => changePassword()}>
        <Text style={[styles.modalButtonText, { color: "#fd7908" }]}>
          Submit Change
        </Text>
      </TouchableOpacity>
    </View>
  );

  const changeDisplayNameModule = (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Enter new display name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TouchableOpacity onPress={() => changeDisplayName()}>
        <Text style={[styles.modalButtonText, { color: "#fd7908" }]}>
          Submit Change
        </Text>
      </TouchableOpacity>
    </View>
  );

  const deleteAccountModule = (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Verify email to delete"
        value={email}
        onChangeText={setEmail}
      />
      {user.providerData[0].providerId === "password" && (
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      )}
      <TouchableOpacity onPress={() => deleteAlert()}>
        <Text style={[styles.modalButtonText, { color: "#fd7908" }]}>
          Permanently Delete Account
        </Text>
      </TouchableOpacity>
    </View>
  );

  async function signOut() {
    try{
      await auth().signOut();
    await GoogleSignin.signOut();
    }
    finally{
    navigation.navigate("Home");
    }
  }

  function changePassword() {
    if (password == "") {
      return alert("Please enter your password");
    }
    if (newPassword1 == "" || newPassword2 == "") {
      return alert("Please enter a new password");
    }
    if (password == newPassword1) {
      return alert("Please use a different password");
    }

    const credential = auth.EmailAuthProvider.credential(user.email, password);
    newPassword1 != newPassword2
      ? alert("The passwords don't match")
      : auth()
          .currentUser.reauthenticateWithCredential(credential)
          .then(() => {
            auth()
              .currentUser.updatePassword(newPassword1)
              .then(() => {
                alert("Password updated!");
                setNewPassword1("");
                setNewPassword2("");
                setPassword("");
                navigation.navigate("Home");
              })
              .catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode);
            if (errorCode == "auth/wrong-password") {
              alert("Sorry, that's not the right password");
            }
          });
  }

  function changeDisplayName() {
    auth()
      .currentUser.updateProfile({
        displayName: displayName,
      })
      .then(() => {
        alert("Display name updated!");
        setDisplayName("");
        setChangeDisplayNameModuleVisble(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  }

  function deleteAlert() {
    if (email != user.email) {
      return alert("That email doesn't match this account.");
    } else {
      Alert.alert(
        `Are you sure?`,
        `Your account and all your recipes will be gone forever`,
        [
          {
            text: `Yes, delete account`,
            onPress:
              user.providerData[0].providerId === "password"
                ? () => deleteEmailAccount()
                : () => deleteGoogleAccount(),
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
  }

  async function deleteGoogleAccount() {
    const { idToken } = await GoogleSignin.signIn();
    const credential = auth.GoogleAuthProvider.credential(idToken);

    database().ref(`/users/${user.uid}/`).remove();

    try {
      await auth()
        .currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          auth().currentUser.delete();
          GoogleSignin.signOut();
        });
      console.log("User reauthenticated successfully!");
    } catch (error) {
      console.error("Error reauthenticating user:", error.message);
    }
  }

  async function deleteEmailAccount() {
    const credential = auth.EmailAuthProvider.credential(user.email, password);

    database().ref(`/users/${user.uid}/`).remove();
    auth()
      .currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        auth().currentUser.delete();
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
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
    let obj = alarmObjects.find((o) => o.url === demoSound);

    try {

      await AsyncStorage.setItem("modern_coffee_alarm_name", demoSound);
    } catch (e) {
      // saving error
    } finally {
      setSelectedAlarm(demoSound);
      setCheckedIndex(obj.indexValue);

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
     <View style={{paddingLeft:10}}>
      <Text style={styles.modalButtonText}>Signed in as:</Text>

      <Text>{user && user.email}</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={[styles.modalButtonText, { color: "#fd7908" }]}>
          Sign out
        </Text>
      </TouchableOpacity>
      <Text>{"\n"}</Text>
      <Text style={{ fontFamily: "Raleway-Medium" }}>Customize</Text>
      <TouchableOpacity
        style={styles.settingsTouchable}
        onPress={() => navigation.navigate("Edit Brew Methods")}
      >
        <Text style={styles.modalButtonText}>Customize Brew Methods</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsTouchable}
        onPress={() => navigation.navigate("Edit Recipe Template")}
      >
        <Text style={styles.modalButtonText}>Customize Recipe Template</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={ styles.settingsTouchable}
        onPress={() => setAlarmModalVisible(!alarmModalVisible)}
      >
        <Text style={styles.modalButtonText}>Change Alarm Sound</Text>
      </TouchableOpacity>


      <Text>{"\n"}</Text>
      <Text style={{ fontFamily: "Raleway-Medium" }}>Account</Text>

      {user.providerData[0].providerId === "password" && (
        <TouchableOpacity
          style={styles.settingsTouchable}
          onPress={() => setPassModalVisible(!passModalVisible)}
        >
          <Text style={styles.modalButtonText}>Change Password</Text>
        </TouchableOpacity>
      )}
      {passModalVisible && changePasswordModule}

      <TouchableOpacity
        style={styles.settingsTouchable}
        onPress={() =>
          setDeleteAccountModuleVisible(!deleteAccountModuleVisible)
        }
      >
        <Text style={styles.modalButtonText}>Delete Account</Text>
      </TouchableOpacity>
      {deleteAccountModuleVisible && deleteAccountModule}
      <Text>{"\n"}</Text>
      <Text>{"\n"}</Text>

      <Text style={styles.modalButtonText}>About</Text>
      <Text style={{ fontFamily: "Raleway-Medium" }}>
        Modern Coffee ver. 0.90.122523.2{"\n"}
        July 2023{"\n"}© 2023 by Robot Lions{"\n"}
        Contact and feedback: info@robotlions.com
      </Text>
      {alarmSelectModal}
      </View>
    </ScrollView>
    </>
  );
}
