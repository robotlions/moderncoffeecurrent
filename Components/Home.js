import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { methodTemplate } from '../Data/Models';
import { styles } from './Styles';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { methodObjects } from '../Data/Models';


export function HomeScreen({ route, navigation }) {
  
  const user = auth().currentUser
  const [loadedMethods, setLoadedMethods] = useState({});
  const [methodList, setMethodList] = useState({});
  
  

  useFocusEffect(
    useCallback(() => {
      let isActive=true;
      database()
      .ref(`/users/${user.uid}/methods/`)
      .on('value', snapshot=> {
      
        if(isActive){
        if (!snapshot.exists()) {
          methodObjects.forEach((item)=>{
            database().ref(`/users/${user.uid}/methods/`)
            .push(item);
          })
        }
        else{
          setMethodList(snapshot.val())
        } 
      }
      })
      return ()=>{
        isActive=false;
      };
    }, [user])
  );



  const favoritesDisplay = 
  <TouchableOpacity
    style={styles.categoryTouchable}
    onPress={() => navigation.navigate('Favorites')}>
    <Text style={styles.categoryText}>Favorites</Text>
  </TouchableOpacity>



  

const methodDisplay = Object.values(methodList)
.sort((a,b)=> a.order-b.order)
.map((item, index) =>
<View key={index}>
  <TouchableOpacity
    style={styles.categoryTouchable}
    onPress={() => navigation.navigate('List Recipes', { filter: String(item.methodName) })}>
    <Text style={styles.categoryText}>{item.methodName}</Text>
  </TouchableOpacity></View>)



 

  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />


      <ScrollView>
        {favoritesDisplay}
        {methodDisplay}
        <TouchableOpacity style={styles.addItemTouchable} onPress={() => navigation.navigate('Create Recipe')}><Text style={[styles.categoryText, { color: "#fd7908" }]}>Create Recipe</Text></TouchableOpacity>
      </ScrollView>
      
    </>
  )

}