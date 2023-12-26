
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

export const testRecipeObject = [
  {methodName:"Pourover"},
  {methodName :"French Press"},
]


export const defaultRecipeObjects = [
  {
  
      "Agitation": {
        order: 13,
        variableValue: "Swirl on second pour"
      },
      "Amount": {
        order: 7,
        variableValue: "15g"
      },
      "Bloom": {
        order: 9,
        variableValue: "30ml for 45 seconds"
      },
      "Brewer": {
        order: 3,
        variableValue: "Pourover Cone"
      },
      "Coffee Brand": {
        order: 5,
        variableValue: "This app is not sponsored"
      },
      "Description": {
        order: 2,
        variableValue: "Clean and medium bodied to get your day going"
      },
      "Grind Size": {
        order: 8,
        variableValue: "Medium fine"
      },
      "Grinder": {
        order: 4,
        variableValue: "Dealer's Choice"
      },
      "Instructions": {
        order: 19,
        variableValue: "On first pour, lightly stir edges of filter to remove stuck coffee grounds, taking care not to disturb coffee bed"
      },
      "Milk Amount": {
        order: 14,
        variableValue: "None"
      },
      "Milk Temp": {
        order: 15,
        variableValue: "NA"
      },
      "Milk Type": {
        order: 16,
        variableValue: "NA"
      },
      "Notes": {
        order: 20,
        variableValue: "This is the default pourover recipe"
      },
      "Recipe Name": {
        order: 1,
        variableValue: "Daily Pourover"
      },
      "Roast": {
        order: 6,
        variableValue: "Light to medium"
      },
      "Sweetener Amount": {
        order: 17,
        variableValue: "NA"
      },
      "Sweetener Type": {
        order: 18,
        variableValue: "NA"
      },
      "Water Amount": {
        order: 10,
        variableValue: "300ml total"
      },
      "Water Temp": {
        order: 11,
        variableValue: "Boiling"
      },
      "Water Type": {
        order: 12,
        variableValue: "Filtered"
      },
      backgroundColor: "#B98D8B",
      method: "Pourover",
      order: 1
    },
    {
  
      "Agitation": {
        order: 13,
        variableValue: "Swirl on second pour"
      },
      "Amount": {
        order: 7,
        variableValue: "15g"
      },
      "Bloom": {
        order: 9,
        variableValue: "30ml for 45 seconds"
      },
      "Brewer": {
        order: 3,
        variableValue: "Pourover Cone"
      },
      "Coffee Brand": {
        order: 5,
        variableValue: "This app is not sponsored"
      },
      "Description": {
        order: 2,
        variableValue: "Clean and medium bodied to get your day going"
      },
      "Grind Size": {
        order: 8,
        variableValue: "Medium fine"
      },
      "Grinder": {
        order: 4,
        variableValue: "Dealer's Choice"
      },
      "Instructions": {
        order: 19,
        variableValue: "On first pour, lightly stir edges of filter to remove stuck coffee grounds, taking care not to disturb coffee bed"
      },
      "Milk Amount": {
        order: 14,
        variableValue: "None"
      },
      "Milk Temp": {
        order: 15,
        variableValue: "NA"
      },
      "Milk Type": {
        order: 16,
        variableValue: "NA"
      },
      "Notes": {
        order: 20,
        variableValue: "This is the default pourover recipe"
      },
      "Recipe Name": {
        order: 1,
        variableValue: "Daily Pourover"
      },
      "Roast": {
        order: 6,
        variableValue: "Light to medium"
      },
      "Sweetener Amount": {
        order: 17,
        variableValue: "NA"
      },
      "Sweetener Type": {
        order: 18,
        variableValue: "NA"
      },
      "Water Amount": {
        order: 10,
        variableValue: "300ml total"
      },
      "Water Temp": {
        order: 11,
        variableValue: "Boiling"
      },
      "Water Type": {
        order: 12,
        variableValue: "Filtered"
      },
      backgroundColor: "#B98D8B",
      method: "French Press",
      order: 1
    }
  
,
];