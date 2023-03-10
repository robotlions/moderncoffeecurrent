import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { styles } from "./Styles";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import * as Functions from "./Functions";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "14249102574-n202743ce00eg8h6rdqjpotmdn3cnmge.apps.googleusercontent.com",
});

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

  const user = auth().currentUser;


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

  function signOut() {
    auth().signOut();
    navigation.navigate("Home");
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
            onPress: () => deleteAccount(),
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

  // function deleteAccount() {

  //   database()
  //     .ref(`/users/${user.uid}/`)
  //     .remove();

  //       auth()
  //         .currentUser
  //         .delete()

  //     .catch((error) => {
  //       const errorCode = error.code
  //       console.log(errorCode)
  //     });

  // }

  //THIS IS THE CORRECT DELETE FUNCTION. THE ONE ABOVE REMOVES THE REAUTHENTICATION FOR TESTING



  function deleteAccount() {
    const credential = auth.EmailAuthProvider.credential(user.email, password);

    // const credential =
    //   user.providerData[0].providerId === "password" ? emailCred : googCred;

    database().ref(`/users/${user.uid}/`).remove();
    if(user.providerData[0].providerId === "password"){
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
  else {
    auth().currentUser.delete()
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
    });
  }
}

  return (
    <ScrollView style={{ paddingLeft: 10 }}>
      <Text style={styles.modalButtonText}>Signed in as:</Text>
      {/* {user && user.displayName ? <Text>{user.displayName}</Text> : <Text>You can change your diplay name below.</Text>} */}
      {/* {console.log(user.providerData[0].providerId)}
      <Text>{String(user.providerData[0].providerId)}</Text> */}
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
        onPress={() => navigation.navigate("Brew Methods")}
      >
        <Text style={styles.modalButtonText}>Customize Brew Methods</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsTouchable}
        onPress={() => navigation.navigate("Recipe Template")}
      >
        <Text style={styles.modalButtonText}>Customize Recipe Template</Text>
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
      {/* <TouchableOpacity style={styles.settingsTouchable} onPress={() => setChangeDisplayNameModuleVisble(!changeDisplayNameModuleVisible)}><Text style={styles.modalButtonText}>Change Display Name</Text></TouchableOpacity>
      {changeDisplayNameModuleVisible && changeDisplayNameModule} */}

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
        Modern Coffee ver. 0.60 build 10{"\n"}
        Feb 2023{"\n"}© 2023 by Robot Lions{"\n"}
        Contact and feedback: info@robotlions.com
      </Text>
    </ScrollView>
  );
}
