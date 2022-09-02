import { Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useCallback, useState } from 'react';
import { styles } from './Styles';
import favoriteIcon from '../assets/images/favoriteIcon.png';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList from 'react-native-draggable-flatlist';



export function ListRecipes({ route, navigation }) {

  const [loadedData, setLoadedData] = useState([]);
  const [loadedRecipe, setLoadedRecipe] = useState({});
  const [loadedID, setLoadedID] = useState("");
  const [loadedMethod, setLoadedMethod] = useState("")
  const [updated, setUpdated] = useState(false);

  const user = auth().currentUser;

  function selectRecipe(item) {
    navigation.navigate("Display Recipe", { loadedMethod: item[1].method, loadedID: item[0], loadedRecipe: item[1] });
  }


  useFocusEffect(
    useCallback(() => {
      setLoadedData([])
      let loading = true
      if (loading === true) {
        database()
        .ref(`/users/${user.uid}/recipes/${route.params.filter}/`)
        .once('value')
        .then((snapshot) => {
          if (snapshot.exists()) {
            // console.log(Object.entries(snapshot.val()))
            setLoadedData(snapshot.val())
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        })
        return() => {loading = false};
      }
    }, [updated]));

  



  const DisplayData = (props) => {

    if (route.params.filter != "Recent" && route.params.filter != "Favorites") {
      return (
        Object.entries(loadedData)
        .sort((a,b) => a[1].order-b[1].order)
          .sort((item) => item[1].favorite != true) //this makes all recipes with favorite==true to list first
          .map((item, index) =>
            route.params.filter === item[1].method && (
              <TouchableOpacity style={styles.entry} key={index} onLongPress={()=>{editAlert(item)}} onPress={() => selectRecipe(item)}>
                <Text style={styles.entryHeadline}>{item[1]["Recipe Name"].variableValue}</Text>
                <Text style={styles.entryDesc}>{item[1]["Description"].variableValue}</Text>
                {item[1].favorite == true ? <Image source={favoriteIcon} style={styles.favorite} /> : <Text> </Text>}
              </TouchableOpacity>)))
    }
    if (route.params.filter === "Favorites") {
      return (
        Object.entries(loadedData)
          .filter((item) => item[1].favorite === true)
          .map((item, index) =>
          (
            <TouchableOpacity style={styles.entry} key={index} onPress={() => selectRecipe(item)}>
              <Text style={styles.entryHeadline}>{item[1]["Recipe Name"].variableValue}</Text>
              <Text style={styles.entryMethod}>{item[1].method}</Text>
              <Text style={styles.entryDesc}>{item[1]["Description"].variableValue}</Text>
              {item[1].favorite == true ? <Image source={favoriteIcon} style={styles.favorite} /> : <Text> </Text>}
            </TouchableOpacity>)))
    }
    else {
      return (
        Object.entries(loadedData)

          .filter((item, index) => index < 5)
          .map((item, index) =>
            <TouchableOpacity style={styles.entry} key={index} onPress={() => selectRecipe(item)}>
              <Text style={styles.entryHeadline}>{item[1]["Recipe Name"].variableValue}</Text>
              <Text style={styles.entryMethod}>{item[1].method}</Text>
              <Text style={styles.entryDesc}>{item[1]["Description"].variableValue}</Text>
              {item[1].favorite == true ? <Image source={favoriteIcon} style={styles.favorite} /> : <Text> </Text>}
            </TouchableOpacity>))

    }
  }


  const methodCheck =
    route.params.filter != "Favorites" && route.params.filter != "Recent" ? { method: route.params.filter } : { method: "" }


    function editAlert(item) {
      Alert.alert(
        `modern coffee`,
        `${item[1]["Recipe Name"].variableValue}`,
        [
          {
            text: `Edit Recipe`,
            onPress: () => navigation.navigate("Edit", {loadedMethod: item[1].method, loadedID: item[0], loadedRecipe: item[1]}),
            style: "cancel",
          },
          {
            text: item[1].favorite == true ? "Remove from favorites" : `Add to Favorites`,
            onPress: () => addRemoveStar(item),
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
  
    function addRemoveStar(item) {
      let fav = item[1].favorite == true ? false : true
      database()
        .ref(`/users/${user.uid}/recipes/${item[1].method}/${item[0]}/`)
        .update(
          {
            favorite: fav
          }
        );
      setUpdated(!updated);
    }


  return (<>
    <ScrollView>
      <DisplayData />
    </ScrollView>
    {route.params.filter != "Favorites" && route.params.filter !="Recent" && <TouchableOpacity onPress={()=>navigation.navigate('Create Recipe', methodCheck)}style={styles.addItemTouchable}><Text style={[styles.categoryText, { color: "#fd7908" }]}>Create {route.params.filter} Recipe</Text></TouchableOpacity>}

  </>
  );
}
