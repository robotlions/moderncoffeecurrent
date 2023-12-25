
export const variableObjects = [
  { variableName: "Recipe Name", order: 1, visible: true, userAdded: false },
  { variableName: "Description", order: 2, visible: true, userAdded: false },
  {
    variableName: "Brewer",
    order: 3,
    visible: true,
    userAdded: false,
  },
  { variableName: "Grinder", order: 4, visible: true, userAdded: false },
  { variableName: "Coffee Brand", order: 5, visible: true, userAdded: false },
  { variableName: "Roast", order: 6, visible: true, userAdded: false },
  { variableName: "Amount", order: 7, visible: true, userAdded: false },
  { variableName: "Grind Size", order: 8, visible: true, userAdded: false },
  { variableName: "Bloom", order: 9, visible: true, userAdded: false },
  { variableName: "Water Amount", order: 10, visible: true, userAdded: false },
  { variableName: "Water Temp", order: 11, visible: true, userAdded: false },
  { variableName: "Water Type", order: 12, visible: true, userAdded: false },
  { variableName: "Agitation", order: 13, visible: true, userAdded: false },
  { variableName: "Milk Amount", order: 14, visible: true, userAdded: false },
  { variableName: "Milk Temp", order: 15, visible: true, userAdded: false },
  { variableName: "Milk Type", order: 16, visible: true, userAdded: false },
  {
    variableName: "Sweetener Amount",
    order: 17,
    visible: true,
    userAdded: false,
  },
  {
    variableName: "Sweetener Type",
    order: 18,
    visible: true,
    userAdded: false,
  },
  { variableName: "Instructions", order: 19, visible: true, userAdded: false },

  { variableName: "Notes", order: 20, visible: true, userAdded: false },
];



export const methodObjects = [
  {
    methodName: "Pourover",
    order: 1,
    backgroundColor: "#A67C83",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/pouroverIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/pouroverBanner600x400.png"),
  },
  {
    methodName: "French Press",
    order: 2,
    backgroundColor: "#7A5546",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/frenchPressIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/frenchPressBanner600x400.png"),




  },
  {
    methodName: "Drip",
    order: 3,
    backgroundColor: "#9E6D5C",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/dripIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/dripBanner600x400.png"),




  },
  {
    methodName: "Moka Pot",
    order: 4,
    backgroundColor: "#5B3118",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/mokaIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/mokaBanner600x400.png"),




  },
  {
    methodName: "Espresso",
    order: 5,
    backgroundColor: "#734729",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/espressoIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/espressoBanner600x400.png"),




  },
  {
    methodName: "AeroPress",
    order: 6,
    backgroundColor: "#AB3625",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/aeropressIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/aeropressBanner600x400.png"),




  },
  {
    methodName: "Cold Brew",
    order: 7,
    backgroundColor: "#935230",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/coldBrewIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/coldBrewBanner600x400.png"),




  },
  {
    methodName: "Percolator",
    order: 8,
    backgroundColor: "#9E6D5C",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/percolatorIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/percolatorBanner600x400.png"),




  },
  {
    methodName: "Turkish",
    order: 9,
    backgroundColor: "#C99074",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/turkishIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/turkishBanner600x400.png"),




  },
  {
    methodName: "Cowboy",
    order: 10,
    backgroundColor: "#B68576",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/cowboyIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/cowboyBanner600x400.png"),
    



  },
  {
    methodName: "Instant",
    order: 11,
    backgroundColor: "#B98D8B",
    visible: true,
    userAdded: false,
    iconUrl: require("../assets/images/icons/instantIconWhite200x200.png"),
    bannerUrl: require("../assets/images/banners/instantBanner600x400.png"),


  },
];

export const alarmObjects = [
  {
    alarmName: "Digital Clock Alarm Buzzer",
    url: "digitalclockalarmbuzzer.wav",
    indexValue: 0,
  },
  {
    alarmName: "Warning Alarm Buzzer",
    url: "warningalarmbuzzer.wav",
    indexValue: 1,
  },
  {
    alarmName: "Alarm Digital Clock Beep",
    url: "alarmdigitalclockbeep.wav",
    indexValue: 2,
  },
  {
    alarmName: "Classic Winner Alarm",
    url: "classicwinneralarm.wav",
    indexValue: 3,
  },
  {
    alarmName: "Morning Clock Alarm",
    url: "morningclockalarm.wav",
    indexValue: 4,
  },
];
export const defaultRecipeObjects = [
  {
    pourover: {
        "Agitation": {
          "order": 13,
          "variableValue": "Nope"
        },
        "Amount": {
          "order": 7,
          "variableValue": "25g"
        },
        "Bloom": {
          "order": 9,
          "variableValue": "Nunya "
        },
        "Brewer": {
          "order": 3,
          "variableValue": "Large one"
        },
        "Coffee Brand": {
          "order": 5,
          "variableValue": "Perc"
        },
        "Description": {
          "order": 2,
          "variableValue": "Vroom vroom"
        },
        "Grind Size": {
          "order": 8,
          "variableValue": "9"
        },
        "Grinder": {
          "order": 4,
          "variableValue": "Fellow Ode"
        },
        "Instructions": {
          "order": 19,
          "variableValue": "You know what to do"
        },
        "Milk Amount": {
          "order": 14,
          "variableValue": "1tsp per cup"
        },
        "Milk Temp": {
          "order": 15,
          "variableValue": "Cold"
        },
        "Milk Type": {
          "order": 16,
          "variableValue": "Cream"
        },
        "Notes": {
          "order": 20,
          "variableValue": "Delicious!"
        },
        "Recipe Name": {
          "order": 1,
          "variableValue": "Weekday juice "
        },
        "Roast": {
          "order": 6,
          "variableValue": "Guatemala "
        },
        "Sweetener Amount": {
          "order": 17,
          "variableValue": "1 tablet per cup"
        },
        "Sweetener Type": {
          "order": 18,
          "variableValue": "Those little saccharin ones"
        },
        "Water Amount": {
          "order": 10,
          "variableValue": "Full 'er up!"
        },
        "Water Temp": {
          "order": 11,
          "variableValue": "Hot, hot, hot "
        },
        "Water Type": {
          "order": 12,
          "variableValue": "Tap"
        },
        "backgroundColor": "#B98D8B",
        "favorite": true,
        "method": "French Press",
        "order": 1
      }
    }
];