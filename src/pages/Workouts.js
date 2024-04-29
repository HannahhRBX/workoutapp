import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';
import ActivityWidget from '../components/ActivityWidget';

// Workouts Page
export default function Workouts({ navigation }) {
  const route = useRoute();
  let user = route.params?.user || null;
  const { selectedTab, setSelectedTab } = useContext(SelectedTabContext);
  const [activities, setActivities] = useState([]);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthNumber = 1; // Replace this with your month number
  const monthName = monthNames[monthNumber - 1]; // Subtract 1 because arrays are 0-indexed
  console.log(monthName);
  // Delete user from local storage and navigate to welcome page
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('Welcome');
    } catch(e) {
      console.error(e);
    }
  }

  // Get all activities from workout API
  const GetActivities = async () => {
    const response = await fetch('https://workoutapi20240425230248.azurewebsites.net/api/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
    // If response ok, set activities to Activities state
    if (response.ok){
      const data = await response.json();
      setActivities(data);
    }

  }

  // Refresh on reload after managing or creating an activity
  useEffect(() => {
    GetActivities();
  }, []);

  // Create and Manage Activity functions
  const Manage = async (activity) => {
    navigation.navigate('ManageActivity', { activity });
  }

  const Create = async () => {
    navigation.navigate('CreateWorkout');
  }

  // Allows for the navigation bar to be rerendered after navigating to different page
  useFocusEffect(
    React.useCallback(() => {
      setSelectedTab('Workouts');
      GetActivities();
    }, [])
  );
  if (user) {
    
    return (
      // Background to be replicated across page
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Top Navigation Bar with Logout and Create Activity buttons */}
          <ImageBackground source={require('../../assets/BarBackground2.png')} style={styles.topBar}>
          <Text style={styles.header}>Workouts</Text>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={logoutUser} image={require('../../assets/Logout.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.topRightButton}>
              <StyledButton title="" onPress={Create} image={require('../../assets/Plus.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            </ImageBackground>

          {/* Container for all Activity widgets with scrollable content box */}
          <View style={styles.innerContainer}>
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: (320 * activities.length) + 200, minHeight: (320 * activities.length) + 200}}>
              {activities.map((activity) => (
                <ActivityWidget key={activity.id} onPress={() => Manage(activity)} activity={activity} />
              ))}
            </ScrollView>
          </View>
        </ImageBackground>
        {/* Bottom Navigation Bar */}
        <NavigationBar onSelect={navigation.navigate} currentPage={selectedTab} />
      </>
    );
  }else{
    return (
      // Display a loading screen while user is being fetched
      <ImageBackground source={Background} style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.header}>Please Wait...</Text>
        </View>
      </ImageBackground>
    );
  }
  
}

// Custom styling for elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth:'100%',
    overflow: 'visible',
    zIndex: 5,
  },
  topBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth:'100%',
    overflow: 'visible',
    zIndex: 6,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 120,
    borderBottomWidth: 0,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#868686',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4.84,
    elevation: 5,
  },
  innerContainer: {
    flex: 1,
    height: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    minWidth:'100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
    zIndex: -5,
    position: 'absolute',
    top: 100,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: 20,
  },
  widgetContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: 500,
    maxWidth: '100%',
    overflow: 'visible',
  },
  input: {
    height: 50,
    width: 320,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'silver',
    padding: 10,
    backgroundColor: '#ffffff',
    fontSize: 18, 
  },
  header: {
    fontSize: 30,
    fontWeight: '600',
    color: '#2f2f2f',
    textAlign: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 57,
  },
  header2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 5,
  },
  topRightButton: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 5,
  },
});