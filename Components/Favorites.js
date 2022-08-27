import { Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useCallback, useState } from 'react';
import { styles } from './Styles';
import favoriteSmiley from '../assets/images/favoriteCarafe.png';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import DraggableFlatList from 'react-native-draggable-flatlist';



export function Favorites({ route, navigation }) {

    // let favArray = []


    const [loadedData, setLoadedData] = useState([]);
    const [loadedRecipe, setLoadedRecipe] = useState({});
    const [loadedID, setLoadedID] = useState("");
    const [loadedMethod, setLoadedMethod] = useState("")

    const user = auth().currentUser;

    function selectRecipe(item) {
        navigation.navigate("Display Recipe", { loadedID: item[0], loadedRecipe: item[1] });
    }

    function getData() {
        database()
            .ref(`/users/${user.uid}/recipes/`)
            .once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let favArray = []
                    snapshot.forEach((childSnap) => {
                        // setLoadedData(Object.entries(childSnap.val()))
                        childSnap.forEach((item)=> {
                            favArray.push(item.val())
                        })
                        // console.log([...favArray])
                        setLoadedData(favArray);
                        
                    })
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            })
        }


    useFocusEffect(
        useCallback(() => {
            let loading = true
            if (loading === true) {
                getData();
                loading = false;
            }
        }, []));





    const displayData = 

// console.log(loadedData[0]["Recipe Name"])
        
            loadedData
                .filter((item) => item.favorite === true)
                .map((item, index) =>
                (
                    <TouchableOpacity style={styles.entry} key={index} onPress={() => selectRecipe(item)}>
                        <Text style={styles.entryHeadline}>{item["Recipe Name"]}</Text>
                        <Text style={styles.entryMethod}>{item.method}</Text>
                        <Text style={styles.entryDesc}>{item["Description"]}</Text>
                        {item.favorite == true ? <Image source={favoriteSmiley} style={styles.favorite} /> : <Text> </Text>}
                    </TouchableOpacity>))
    



    return (
        <ScrollView>
           {displayData}
        </ScrollView>

    
    );
}
