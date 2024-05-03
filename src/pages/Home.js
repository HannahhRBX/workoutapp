import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';
import WorkoutGraph from '../components/WorkoutGraphWidget';

// Registration Page
export default function Home({ navigation }) {
  const route = useRoute();
  let user = route.params?.user || null;
  const { selectedTab, setSelectedTab } = useContext(SelectedTabContext);
  const [workouts, setWorkouts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  workouts.map((workout, index) => {
    console.log(workout);
  });
  // Delete user from local storage and navigate to welcome page
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('Welcome');
    } catch(e) {
      console.error(e);
    }
  }

  // Get all workouts by UserID from workout API
  const GetWorkouts = async () => {
    try {
      if (user) {
        const response = await fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/user/${user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
        });
        // If response ok, set retrieved workouts to workouts state
        if (response.ok){
          const text = await response.text();
          if (!text) {
            console.log('No data returned from the server');
            setWorkouts([]);
          } else {
            const data = JSON.parse(text);
            setWorkouts(data);
          }
        }else{
          const text = await response.text();
          if (!text) {
            console.log('No data returned from the server');
          } else {
            const data = JSON.parse(text);
            console.log(data);
          }
        }
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Refresh on reload after managing or creating a workout
  useEffect(() => {
    GetWorkouts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    GetWorkouts().then(() => setRefreshing(false));
  }, []);

  // Allows for the navigation bar to be rerendered after navigating to a different page
  useFocusEffect(
    React.useCallback(() => {
      setSelectedTab('Home');
    }, [])
  );
  if (user) {
    
    return (
      // Background to be replicated across app
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Form and buttons for navigation */}
          <ImageBackground source={require('../../assets/BarBackground2.png')} style={styles.topBar}>
          <Text style={styles.header}>Home</Text>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={logoutUser} image={require('../../assets/Logout.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            
            </ImageBackground>
          <View style={styles.innerContainer}>
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: (830 ) + 200, minHeight: (830) + 200, width: 370}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
              <WorkoutGraph workouts={workouts} days={7} />
              <WorkoutGraph workouts={workouts} days={30} />
              

            </ScrollView>
          </View>
      </ImageBackground>
      <NavigationBar onSelect={navigation.navigate} currentPage={selectedTab} />
      </>
    );
  }else{
    return (
      <ImageBackground source={Background} style={styles.container}>
        {/* Form and buttons for navigation */}
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
    width:'100%',
  },
  innerContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  widgetContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
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
    zIndex: 15,
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
});