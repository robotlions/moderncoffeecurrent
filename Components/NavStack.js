import { HomeScreen } from "./Home";
import { CreateRecipe } from "./CreateRecipe";
import { ListRecipes } from "./ListRecipes";
import { Settings } from "./Settings";
import { EditRecipe } from "./EditRecipe";
import { BrewMethods } from "./BrewMethods";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DisplayRecipe } from "./DisplayRecipe";
import { Favorites } from "./Favorites";
import { RecipeTemplate } from "./RecipeTemplate";
import { EditSingleRecipeTemplate } from "./EditSingleRecipeTemplate";
import { StandaloneTimer } from "./StandaloneTimer";
import { Image } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function NavStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerTitleStyle: { fontFamily: "Raleway-Bold" } }}
    >
      <Stack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="List Recipes"
        component={ListRecipes}
        options={({ route }) => ({ title: route.params.filter })}
      />
      <Stack.Screen name="Edit" component={EditRecipe} />
      <Stack.Screen
        name="Edit Single Recipe"
        component={EditSingleRecipeTemplate}
      />
      <Stack.Screen name="Brew Methods" component={BrewMethods} />
      <Stack.Screen name="Recipe Template" component={RecipeTemplate} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen
        name="Display Recipe"
        component={DisplayRecipe}
        options={({ route }) => ({
          title: `Recipe for ${route.params.loadedRecipe.method}`,
        })}
      />
    </Stack.Navigator>
  );
}

export function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarStyle:{backgroundColor: "rgba(253,121,8,.8)", paddingTop: 3},
        tabBarStyle: { backgroundColor: "white", paddingTop: 3 },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "rgb(159, 50, 1)",
        // tabBarActiveTintColor: "rgb(253, 121, 8)",

        tabBarInactiveTintColor: "rgba(159, 50, 1,.4)",
        // tabBarInactiveTintColor: "rgba(253, 121, 8,.4)",

        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, fontFamily: "Raleway-Bold" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={NavStack}
        options={{
          tabBarIcon: (props) => {
            return (
              <Image
                style={{
                  tintColor: props.color,
                  height: 30,
                  width: 30,
                }}
                source={require("../assets/images/homeIcon.png")}
              />
            );
          },
          title: "Home",
          headerTitleStyle: { fontFamily: "Raleway-Bold" },
        }}
      />
      {/* <Tab.Screen
        name="Create Recipe"
        component={CreateRecipe}
        options={{
          // tabBarStyle: { display: "none" },
          tabBarIcon: (props) => {
            return (
              <Image
                style={{
                  tintColor: props.color,
                  height: 30,
                  width: 30,
                }}
                source={require("../assets/images/addIcon.png")}
              />
            );
          },

          title: "Create Recipe",
          headerTitleStyle: { fontFamily: "Raleway-Bold" },
        }}
      /> */}
      <Tab.Screen
        name="Timer"
        component={StandaloneTimer}
        options={{
          tabBarIcon: (props) => {
            return (
              <Image
                style={{
                  tintColor: props.color,
                  height: 30,
                  width: 30,
                }}
                source={require("../assets/images/timerIcon.png")}
              />
            );
          },

          title: "Timer",
          headerTitleStyle: { fontFamily: "Raleway-Bold" },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: (props) => {
            return (
              <Image
                style={{
                  tintColor: props.color,
                  height: 30,
                  width: 30,
                }}
                source={require("../assets/images/settingsIcon.png")}
              />
            );
          },
          title: "Settings",
          headerTitleStyle: { fontFamily: "Raleway-Bold" },
        }}
      />
    </Tab.Navigator>
  );
}
