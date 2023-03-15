import reactDom from 'react-dom';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

export const scale = Dimensions.get('window').scale
export const winWidth = Dimensions.get('window').width
export const winHeight = Dimensions.get('window').height

export const styles = StyleSheet.create({

  addItemTouchable: {
    borderWidth: 1,
    borderColor: "#fd7908",
    backgroundColor: "#fd7908",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    minHeight: winHeight *.07,
    justifyContent: "center",
    marginTop: 50,


  },

  buttonStandard: {
    fontFamily: "Raleway-Bold",
    // color: "#9f3201",
    color: "white",
    fontSize: 18,
    backgroundColor: "#fd7908",
    textAlign: "center",
    elevation: 3,
    height: 40,
    textAlignVertical: "center",
    marginBottom: 5,
    borderRadius: 3,
  },

  buttonRow: {
    flexDirection: "row",
  },

  buttonTextStyle: {
    color: "red",
    fontFamily: "Raleway-Medium",
  },
  categoryTouchable: {
    marginTop: 20,
    height: winHeight *.13,
    justifyContent: "center",
    elevation: 2,
    },

  categoryText: {
    textAlign: "center",
    fontFamily: "Corben-Bold",
    fontSize: scale * 8,
    paddingLeft: 5,
    color: "white",
    textShadowColor:"#39230E",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },

  customFieldEntry: {
    elevation: 2,
    marginBottom: 3,
    paddingLeft: 5,

  },
  deleteButton: {
    color: "red",
    fontFamily: "Raleway-Medium",
  },
  displayName: {
    position: "absolute",
    marginTop: 10,
    fontFamily: "Raleway-Medium",
    color: "#fd7908",
    fontSize: 15,
    paddingLeft: 5,

  },
  entry: {
    width: "100%",
    // backgroundColor: "rgba(224, 163, 104,1)",
    elevation: 1,
    backgroundColor: "white",
    height: winHeight *.1,
    marginBottom: 8,
  },

  entryHeadline: {
    fontSize: scale * 8,
    fontFamily: "Corben-Bold",
    paddingLeft: 5,
    color: "white",
    textShadowColor:"#39230E",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  entryDesc: {
    fontFamily: "Raleway-Medium",
    color: "black",
    paddingLeft: 5,
    // fontStyle: "italic",

  },
  entryMethod: {
    fontFamily: "Raleway-Black",
    paddingLeft: 5,
    color: "white",

  },
  favorite: {
    height: 15,
    width: 20,
    position: "absolute",
    right: 10,
    bottom: 5,
  },
  input: {
    borderColor: "gray",
    borderWidth: .5,
    height: 40,
    width: "90%",
    padding: 5,
    backgroundColor:"white",
    elevation: 1,
    marginBottom: 5,
  },

  inputLogin: {
    borderColor: "gray",
    borderWidth: 1,
    height: 40,
    width: "90%",
    padding: 5,
    backgroundColor:"white",
    // elevation: 1,
    marginBottom: 5,
  },
  //   listTitleHeadline: {
  //     fontFamily: "Raleway-Bold",
  //     fontSize: 30,
  //     paddingLeft: 5,
  //     marginBottom: 10,
  //     alignSelf: "center",
  //   },

  mainTitleText: {
    fontFamily: "Corben-Bold",
    fontSize: 45,
    lineHeight: 65,
    textAlign: "center",
    color: "#fd7908",
    // textShadowColor: "rgb(69,51,23)",
    textShadowColor: "white",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 1,
    marginTop: 50,
  },
  modalButton: {
    height: 50,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    marginLeft: 5,
  },
  modalButtonText: {
    fontFamily: "Raleway-Bold",
    // color: "rgb(1, 57, 72)",
    // color: "#9f3201",
    color: "#fd7908",
    fontSize: 20,
  },

  modalView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
    marginBottom: 75,
  },

  navIcons: {
    marginRight: 10,
    height: 40,
    width: 40,
    opacity: .8,
  },

  picker: {
    width: "90%",
  },

  recipeModalText: {
    fontFamily: "Raleway-Medium",
  },

  recipeModalCategory: {
    fontFamily: "Raleway-Bold",
  },

  scrollViewStyle:{
//insert main app background color here
  },

 
  settingsTouchable:{
    marginBottom: 5,
  },

  timerIcons: {
    height: 16 * scale,
    width: 16 * scale,
    tintColor: "#9f3201",
    opacity: .9,
  },

  //   scrollView: {
  //     alignItems: "center",
  //   },

  timerView: {
    justifyContent: "center",

    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
  },

  variableEntry: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 5,
alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,

  },
  variableText: {
    fontFamily: "Raleway-Medium",
    fontSize: 20,
    maxWidth:'60%'

  },

  XcloseIcon: {
    textAlign: "right",
    fontSize: 20,
    // fontWeight: "bold",
    fontFamily: "Raleway-Black",
  },
});
