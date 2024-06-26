import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';
import WorkoutWidget from '../components/WorkoutWidget';
import { CreateWorkoutActivityContext } from '../../CreateWorkoutActivityContext';
import { UserContext } from '../../UserContext';

// Workouts Page
export default function Workouts({ navigation }) {
  // Use route params to get user
  const [user, setUser] = useContext(UserContext);
  const { selectedTab, setSelectedTab } = useContext(SelectedTabContext);
  const [createWorkoutActivities, setCreateWorkoutActivities] = useContext(CreateWorkoutActivityContext);
  const [refreshing, setRefreshing] = React.useState(false);
  const [workouts, setWorkouts] = useState([]);

  // Delete user from local storage and navigate to welcome page
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setCreateWorkoutActivities([]);
      setUser([]);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
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
            // Sort workouts by timestamp
            data.sort((a, b) => parseInt(b.timestamp, 10) - parseInt(a.timestamp, 10));
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
      
      }
    } catch (error) {
      
    }
  }

  // Refresh on reload after managing or creating a workout
  useEffect(() => {
    setCreateWorkoutActivities([]);
    GetWorkouts();
  }, []);

  

  const GetActivitiesFromWorkout = async (workout) => {
    const initialWorkoutActivities = workout.workoutActivities;
    setCreateWorkoutActivities(initialWorkoutActivities.map((activity) => ({ activity: activity.activityDetails, activityID: activity.activityID, duration: activity.duration, id: activity.id })));
  }

  // Create and Manage Activity functions
  const Manage = async (workout) => {
    await GetActivitiesFromWorkout(workout);
    navigation.navigate('ManageWorkout', { workout });
  }

  const Create = async () => {
    navigation.navigate('CreateWorkout');
  }

  // Allows for the navigation bar and workouts to be rerendered after navigating to different page
  useFocusEffect(
    React.useCallback(() => {
      setCreateWorkoutActivities([]);
      if (user) {
        setSelectedTab('Workouts');
        GetWorkouts();
      }
    }, []) // Only re-run the effect if `user` changes
  );

  
  // Refresh control for workouts
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    GetWorkouts().then(() => setRefreshing(false));
  }, []);
  
  if (user && workouts.length > 0) {
    
    return (
      // Background to be replicated across page
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Top Navigation Bar with Logout and Create Workout buttons */}
          <ImageBackground source={require('../../assets/BarBackground2.png')} style={styles.topBar}>
          <Text style={styles.header}>Workouts</Text>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={logoutUser} image={require('../../assets/Logout.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.topRightButton}>
              <StyledButton title="" onPress={Create} image={require('../../assets/Plus.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            </ImageBackground>

          {/* Container for all Workout widgets with scrollable content box */}
          <View style={styles.innerContainer}>
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: (320 * workouts.length) + 200, minHeight: (320 * workouts.length) + 200}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <WorkoutWidget key={workout.id} onPress={() => Manage(workout)} workout={workout} buttonText={"Details"} />
                ))
                ) : (
                  <Text style={styles.header}></Text>
                )
              }
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
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Top Navigation Bar with Logout and Create Workout buttons */}
          <ImageBackground source={require('../../assets/BarBackground2.png')} style={styles.topBar}>
          <Text style={styles.header}>Workouts</Text>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={logoutUser} image={require('../../assets/Logout.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.topRightButton}>
              <StyledButton title="" onPress={Create} image={require('../../assets/Plus.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            </ImageBackground>

          {/* Container for all Workout widgets with scrollable content box */}
          <View style={styles.innerContainer}>
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: (320 * workouts.length) + 200, minHeight: (320 * workouts.length) + 200}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
              <Text style={styles.emptyTitle}>No Workouts to Display.</Text>
            </ScrollView>
          </View>
        </ImageBackground>
        {/* Bottom Navigation Bar */}
        <NavigationBar onSelect={navigation.navigate} currentPage={selectedTab} />
      </>
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
  emptyTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#2f2f2f',
    textAlign: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 45,
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