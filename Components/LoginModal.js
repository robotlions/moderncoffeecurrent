import { View, Text, TextInput, Modal, TouchableOpacity, Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import { styles } from "./Styles";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import { methodObjects, variableObjects } from "../Data/Models";
import { defaultRecipeObjects } from "../Data/DefaultRecipes";
import AsyncStorage from "@react-native-async-storage/async-storage";


GoogleSignin.configure({
  webClientId:
    "14249102574-n202743ce00eg8h6rdqjpotmdn3cnmge.apps.googleusercontent.com",
});

async function onGoogleButtonPress() {
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  return auth()
    .signInWithCredential(googleCredential)
    .then((googleCredential) => {
      if (googleCredential.additionalUserInfo.isNewUser) {
        createNewUserDatabaseEntry(),
        createLocalStorageItems();
      }
      else{
        updateDatabaseLogin()
      }
    });
}

function updateDatabaseLogin(){

const account = auth().currentUser;
  const accountObject = {
    uid: account.uid,
    email: account.email,
    displayName: account.displayName,
    providerId: account.providerId,
    emailVerified: account.emailVerified,
    phoneNumber: account.phoneNumber,
    photoURL: account.photoURL,
    providerType: account.providerData[0].providerId,
    createdOn: account.metadata.creationTime,
    lastSignIn: account.metadata.lastSignInTime,
  };
  database()
    .ref(`/users/${auth().currentUser.uid}/account/`)
    .update(accountObject);
}

function createNewUserDatabaseEntry() {
  const account = auth().currentUser;
  const accountObject = {
    uid: account.uid,
    email: account.email,
    displayName: account.displayName,
    providerId: account.providerId,
    emailVerified: account.emailVerified,
    phoneNumber: account.phoneNumber,
    photoURL: account.photoURL,
    providerType: account.providerData[0].providerId,
    createdOn: account.metadata.creationTime,
    lastSignIn: account.metadata.lastSignInTime,
  };
  database()
    .ref(`/users/${auth().currentUser.uid}/account/`)
    .set(accountObject);
  database()
    .ref(`/users/${auth().currentUser.uid}/methods/`)
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        methodObjects.forEach((item) => {
          database()
            .ref(`/users/${auth().currentUser.uid}/methods/`)
            .push(item);
        });
      }
    });
  database()
    .ref(`/users/${auth().currentUser.uid}/variables/`)
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        variableObjects.forEach((item) => {
          database()
            .ref(`/users/${auth().currentUser.uid}/variables/`)
            .push(item);
        });
      }
    });
    defaultRecipeObjects.forEach((item)=>{
      database()
    .ref(`/users/${auth().currentUser.uid}/recipes/${item.method}`)
      .push(item);
    })
    
}

async function createLocalStorageItems(){
  try {
    await AsyncStorage.setItem("modern_coffee_featured", "true");
  } catch (e) {
    console.error(e);
  }
}

function emailSentAlert() {
  Alert.alert(
    `modern coffee`,
    `Thank you for joining Modern Coffee! Please check your inbox for a verification email.`,
    [
      {
        text: `Got it!`,
        onPress: () => auth().signOut(),
        style: "cancel",
      },
      
    ],
    {
      cancelable: false,
    }
  );
}

export const LoginModal = (props, navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [recoverPasswordModalVisible, setRecoverPasswordModalVisible] =
    useState(false);
  const [emailLoginModalVisible, setEmailLoginModalVisible] = useState(false);
  const passwordRef = useRef();
  const password2Ref = useRef();
  
  function createUser() {
    if (email === "" || password === "") {
      return alert("Please provide email and password");
    }
    if (password != password2) {
      return alert("The passwords don't match");
    } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          if (userCredential.additionalUserInfo.isNewUser) {
            createNewUserDatabaseEntry(),
            createLocalStorageItems();
          }
          // auth().currentUser.sendEmailVerification();
          // emailSentAlert();
          // alert(
          //   "Thanks for joining Modern Coffee! Please check your inbox for a verification email."
          // );
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            alert(
              "That email address is already in use. Did you create an account by signing in through Google?"
            );
          }

          if (error.code === "auth/invalid-email") {
            alert("That email address is invalid.");
          }
          if (error.code === "auth/weak-password") {
            alert("Password must be a minimum of six characters.");
          }

          console.log(error.code, error.message);
        });
    }
  }

  function signIn() {
    if (email == "" || password == "") {
      return alert("Please enter email and password");
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(()=>{updateDatabaseLogin()})
      .catch((error) => {
        console.log(error.code);
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          alert("No user by that name");
        }
        if (errorCode === "auth/invalid-email") {
          alert("Please enter a valid email address");
        }
        if (errorCode === "auth/wrong-password") {
          alert(
            "This password doesn't match the email. Did you create your account by signing in through Google?"
          );
        }
      });
  }

  function triggerEmailReset() {
    if (email == "" || email == " ") {
      return alert("Please enter a valid email address.");
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password email sent!");
        setRecoverPasswordModalVisible(false);
        setEmail("");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
      });
  }



  // function createNewUserDatabaseEntry() {
  //   const account = auth().currentUser;
  //   const accountObject = {
  //     uid: account.uid,
  //     email: account.email,
  //     displayName: account.displayName,
  //     providerId: account.providerId,
  //     emailVerified: account.emailVerified,
  //     phoneNumber: account.phoneNumber,
  //     photoURL: account.photoURL,
  //     providerType: account.providerData[0].providerId,
  //     createdOn: account.metadata.creationTime,
  //     lastSignIn: account.metadata.lastSignInTime,
  //   };
  //   database()
  //     .ref(`/users/${auth().currentUser.uid}/account/`)
  //     .set(accountObject);
  //   database()
  //     .ref(`/users/${auth().currentUser.uid}/methods/`)
  //     .once("value", (snapshot) => {
  //       if (!snapshot.exists()) {
  //         methodObjects.forEach((item) => {
  //           database()
  //             .ref(`/users/${auth().currentUser.uid}/methods/`)
  //             .push(item);
  //         });
  //       }
  //     });
  //   database()
  //     .ref(`/users/${auth().currentUser.uid}/variables/`)
  //     .once("value", (snapshot) => {
  //       if (!snapshot.exists()) {
  //         variableObjects.forEach((item) => {
  //           database()
  //             .ref(`/users/${auth().currentUser.uid}/variables/`)
  //             .push(item);
  //         });
  //       }
  //     });
  // }

  if (recoverPasswordModalVisible == true) {
    return (
      <Modal animationType="slide" transparent={true}>
        <View
          style={{
            paddingTop: 100,
            height: "100%",
            backgroundColor: "rgba(52, 52, 52, 0.7)",
          }}
        >
          <View style={[styles.modalView, { alignItems: "center" }]}>
            <TextInput
              style={styles.inputLogin}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              placeholder="Email"
              onSubmitEditing={() => triggerEmailReset()}
              blurOnSubmit={false}
            />

            <TouchableOpacity onPress={() => triggerEmailReset()}>
              <Text style={styles.modalButtonText}>Recover Password</Text>
            </TouchableOpacity>
            <Text>{"\n"}</Text>
            <TouchableOpacity
              onPress={() => {
                setRecoverPasswordModalVisible(false),
                  setCreateModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Return to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (emailLoginModalVisible == true) {
    return (
      <Modal animationType="slide" transparent={true}>
        <View
          style={{
            paddingTop: 100,
            height: "100%",
            backgroundColor: "rgba(52, 52, 52, 0.7)",
          }}
        >
          <View style={[styles.modalView, { alignItems: "center" }]}>
            <TextInput
              style={styles.inputLogin}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              placeholder="Email"
              onSubmitEditing={() => passwordRef.current.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              ref={passwordRef}
              secureTextEntry={true}
              style={styles.inputLogin}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              onSubmitEditing={() => signIn()}
            />
            <TouchableOpacity
              style={{ marginTop: 10, width: "89%" }}
              onPress={() => signIn()}
            >
              <Text style={styles.buttonStandard}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => [
                setEmailLoginModalVisible(false),
                setCreateModalVisible(true),
              ]}
            >
              <Text style={styles.modalButtonText}>Create Account</Text>
            </TouchableOpacity>
            <Text>or</Text>
            <TouchableOpacity
              onPress={() => setRecoverPasswordModalVisible(true)}
            >
              <Text style={styles.modalButtonText}>Recover Password</Text>
            </TouchableOpacity>
            <Text>or</Text>
            <TouchableOpacity onPress={() => setEmailLoginModalVisible(false)}>
              <Text style={styles.modalButtonText}>Back to Google Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (createModalVisible == true) {
    return (
      <Modal animationType="slide" transparent={true}>
        <View
          style={{
            paddingTop: 100,
            height: "100%",
            backgroundColor: "rgba(52, 52, 52, 0.7)",
          }}
        >
          <View style={[styles.modalView, { alignItems: "center" }]}>
            <TextInput
              style={styles.inputLogin}
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              placeholder="Email"
              onSubmitEditing={() => passwordRef.current.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              ref={passwordRef}
              secureTextEntry={true}
              style={styles.inputLogin}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              onSubmitEditing={() => password2Ref.current.focus()}
            />
            <TextInput
              ref={password2Ref}
              secureTextEntry={true}
              style={styles.inputLogin}
              value={password2}
              onChangeText={setPassword2}
              placeholder="Re-enter Password"
              onSubmitEditing={() => createUser()}
            />

            <TouchableOpacity
              style={{ marginTop: 10, width: "89%" }}
              onPress={() => createUser()}
            >
              <Text style={styles.buttonStandard}>Create Account</Text>
            </TouchableOpacity>
            <Text>{"\n"}</Text>
            <TouchableOpacity
              onPress={() => {
                setCreateModalVisible(false),
                  setRecoverPasswordModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Return to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else {
    return (
      <Modal animationType="slide" transparent={true}>
        <View
          style={{
            paddingTop: "50%",
            height: "100%",
            backgroundColor: "rgba(52, 52, 52, 0.7)",
          }}
        >
          <View style={[styles.modalView, { alignItems: "center" }]}>
            <GoogleSigninButton
              style={{ maxWidth: "100%", maxHeight: 70, marginBottom: 20 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => onGoogleButtonPress()}
            />
            <Text style={styles.modalButtonText}>or</Text>

            <TouchableOpacity onPress={() => setEmailLoginModalVisible(true)}>
              <Text
                style={[
                  styles.buttonStandard,
                  { paddingLeft: 10, paddingRight: 10, marginTop: 20 },
                ]}
              >
                Sign in with email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
};
