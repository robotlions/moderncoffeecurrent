import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

export const scale = Dimensions.get("window").scale;
export const winWidth = Dimensions.get("window").width;
export const winHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  addItemTouchable: {
    borderWidth: 1,
    borderColor: "#fd7908",
    backgroundColor: "#fd7908",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    minHeight: winHeight * 0.07,
    justifyContent: "center",
    marginTop: 20,
    width:"100%",
  },

  buttonStandard: {
    fontFamily: "Raleway-Bold",
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
    height: winHeight * 0.22,
    width: winHeight * 0.22,
    justifyContent: "center",
    borderRadius: 20,
  },

  categoryText: {
    textAlign: "center",
    fontFamily: "Corben-Bold",
    fontSize: scale * 8,
    paddingLeft: 10,
    paddingRight:10,
    color: "white",
    textShadowColor: "#39230E",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    elevation: 1,
    backgroundColor: "white",
    minHeight: winHeight * 0.1,
    marginBottom: 8,
  },

  entryHeadline: {
    fontSize: scale * 8,
    fontFamily: "Corben-Bold",
    paddingLeft: 5,
    color: "#fd7908",
    textShadowColor: "#39230E",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  entryDesc: {
    fontFamily: "Raleway-Medium",
    color: "white",
    paddingLeft: 5,
    marginRight: 40,
    paddingBottom: 10,
  },
  entryMethod: {
    fontFamily: "Raleway-Black",
    paddingLeft: 5,
    color: "white",
  },
  favorite: {
    height: 25,
    width: 25,
    position: "absolute",
    right: 10,
    bottom: 10,
  },

  imageBackground:{
    maxHeight:winHeight*.25,
    minHeight:winHeight*.20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  imageBackgroundHome:{
    maxHeight:winHeight*.35,
    minHeight:winHeight*.30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  inactiveButton: {
    textAlign: "center",
    fontFamily: "Raleway-Bold",
    color: "gray",
    fontSize: 20,
  },
  input: {
    borderColor: "gray",
    borderWidth: 0.5,
    width: "90%",
    padding: 5,
    paddingTop: 10,
    backgroundColor: "white",
    marginBottom: 5,
  },

  inputLogin: {
    borderColor: "gray",
    borderWidth: 1,
    height: 40,
    width: "90%",
    padding: 5,
    backgroundColor: "white",
    elevation: 1,
    marginBottom: 5,
  },

  mainTitleText: {
    fontFamily: "Corben-Bold",
    fontSize: scale*18,
    lineHeight: scale*25,
    textAlign: "center",
    color: "#fd7908",
    textShadowColor: "white",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 1,
    paddingTop: winHeight*.05,
    paddingLeft:10,
    paddingRight:10,
  },

  menuHeading: {
    fontFamily: "Raleway-Medium",
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },

  menuTouchable:{
  
      fontFamily: "Raleway-Bold",
      color: "#fd7908",
      fontWeight: "bold",
      fontSize: 20,
    },
    
  methodBannerText: {
    fontFamily: "Corben-Bold",
    fontSize: scale*18,
    lineHeight: scale*25,
    textAlign: "center",
    color: "#fd7908",
    textShadowColor: "white",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 1,
    paddingLeft:"5%",
    paddingRight: "5%",
  
  },
  methodIcon:{
    position:"absolute",
    bottom: 10,
    right: 10,
    width: winHeight*.05,
    height: winHeight*.05,
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
  },

  navIcons: {
    marginRight: 10,
    height: 40,
    width: 40,
    opacity: 0.8,
  },

  netWarningText:{
    fontWeight: "bold",
    fontSize: 15,
    backgroundColor: "gray",
    color: "white",
    paddingLeft: 7,
    borderRadius: 5,
    alignSelf:"flex-start",
    height: 30,
    verticalAlign:"middle"
  },

  netWarningWindow:{
   marginLeft: 10,
   marginTop: 5,
  },

  picker: {
    width: "90%",
  },

  recipeVariableTouchable: {
    elevation: 2,
    backgroundColor: "white",
    marginBottom: 10,
    minHeight: winHeight * 0.06,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: winHeight * 0.01,
  },

  recipeModalText: {
    fontFamily: "Raleway-Medium",
  },

  recipeModalCategory: {
    fontFamily: "Raleway-Bold",
  },

  scrollViewStyle: {
    //insert main app background color here
  },

  settingsTouchable: {
    marginBottom: 5,
  },

  timerIcons: {
    height: 16 * scale,
    width: 16 * scale,
    tintColor: "#9f3201",
    opacity: 0.9,
  },

  timerInput: {
    borderColor: "gray",
    borderWidth: 0.5,
    width: "90%",
    padding: 5,
    backgroundColor: "white",
    marginBottom: 5,
  },

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
    minHeight: winHeight * 0.05,
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  variableText: {
    fontFamily: "Raleway-Medium",
    fontSize: 20,
    maxWidth: "60%",
  },

  XcloseIcon: {
    textAlign: "right",
    fontSize: 20,
    // fontWeight: "bold",
    fontFamily: "Raleway-Black",
  },
});
