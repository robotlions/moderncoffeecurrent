import { Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useCallback, useState } from 'react';
import { styles } from './Styles';
import favoriteIcon from '../assets/images/favoriteIcon.png';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';



export function Favorites({ route, navigation }) {



    const [loadedData, setLoadedData] = useState([]);
    // const [loadedRecipe, setLoadedRecipe] = useState({});
    // const [loadedID, setLoadedID] = useState("");
    // const [loadedMethod, setLoadedMethod] = useState("")

    const user = auth().currentUser;

    function selectRecipe(item, key, value) {
        navigation.navigate("Display Recipe", { loadedMethod: value.method, loadedID: key, loadedRecipe: value });
    }

    function getData() {
        database()
            .ref(`/users/${user.uid}/recipes/`)
            .once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let favArray = []
                    snapshot.forEach((item) => {
                            favArray.push(item.val())
                    })
                    setLoadedData(favArray);

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

    


            Object.values(loadedData)
                .map((item, index) => Object.entries(item).filter(([key, value]) => value.favorite ==true )
                .map(([key, value]) =>
                (
                    <TouchableOpacity style={styles.entry} key={index} onPress={() => selectRecipe(item, key, value)}>
                        <Text style={styles.entryHeadline}>{value["Recipe Name"].variableValue}</Text>
                        <Text style={styles.entryMethod}>{value.method}</Text>
                        <Text style={styles.entryDesc}>{value["Description"].variableValue}</Text>
                        {value.favorite == true ? <Image source={favoriteIcon} style={styles.favorite} /> : <Text> </Text>}
                    </TouchableOpacity>)))
    



    return (
        <ScrollView>
           {displayData}
        </ScrollView>

    
    );
}
