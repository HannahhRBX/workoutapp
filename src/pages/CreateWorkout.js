import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import SubmitBar from '../components/SubmitBar';
import WorkoutActivityWidget from '../components/WorkoutActivityWidget';
import AddWidget from '../components/AddWidget';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CreateWorkoutActivityContext } from '../../CreateWorkoutActivityContext';

// Create Workout Page
export default function CreateWorkout({ navigation }) {
  const route = useRoute();
  let user = route.params?.user || null;
   
  // Use context to get and set activities for the workout
  const [createWorkoutActivities, setCreateWorkoutActivities] = useContext(CreateWorkoutActivityContext);
  const [date, setDate] = useState(new Date());
  const [timestamp, setTimestamp] = useState('');
  const [stringStamp, setStringStamp] = useState('Select Date');

  const CalculateTime = (time) => {
    const timestampInt = parseInt(time, 10);
    const dateFromTimestamp = new Date(timestampInt);
    // Split date into weekday, day, month, and year
    const day = dateFromTimestamp.toLocaleDateString('en-US', { day: '2-digit' });
    const month = dateFromTimestamp.getMonth() + 1; // Months are 0-based in JavaScript
    const year = dateFromTimestamp.toLocaleDateString('en-US', { year: 'numeric' });
    setStringStamp(`${day}/${month < 10 ? '0' + month : month}/${year}`);
  }

  const [show, setShow] = useState(false);
  // Get all activities from workout API
  const GetActivitiesFromWorkout = async () => {
    if (user) {
      const response = await fetch('https://workoutapi20240425230248.azurewebsites.net/api/workouts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
      });
      // If response ok, set activities to Activities state
      if (response.ok){
        const data = await response.json();
      
      }
    }
  } 

  // Add Activity to Workout
  const AddActivity = async () => {
    navigation.navigate('AddActivities', {
      redirect:"CreateWorkout",
    });
  };

  const Create = async () => {
    if (user) {
      // Form validation to check for empty timestamp or activity array
      if (createWorkoutActivities.length == 0){
        alert('Please add at least one activity to the workout');
        return;
      }
      if (timestamp == ''){
        alert('Please select a date for the workout');
        return;
      }
      // POST request to create a workout using userId with timestamp
      const response = await fetch('https://workoutapi20240425230248.azurewebsites.net/api/workouts', {
          method: 'POST',
          body: JSON.stringify({
            userID: user.id,
            timestamp: timestamp,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
      });
      // If response ok, create workout activities using newly created workout ID
      if (response.ok){
        const data = await response.json();
        const workoutID = data.id;
        // Iterate through activity state and create link table WorkoutActivity entries for each activity
        createWorkoutActivities.forEach(async (activityItem) => {
          const response = await fetch('https://workoutapi20240425230248.azurewebsites.net/api/workouts/activity', {
            method: 'POST',
            body: JSON.stringify({
              workoutID: workoutID,
              activityID: activityItem.activity.id,
              duration: activityItem.duration,
            }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
          });
          if (response.ok){
            const data = await response.json();
          }
        }
        );
      }else{
        alert('Failed to create workout');
      };

      navigation.navigate('Workouts');
    }
  };

  // Send to Manage Workout Activity Page
  const Manage = async (workoutActivity, index) => {
    
    navigation.navigate('ManageWorkoutActivity', { workoutActivity, index, redirect:"CreateWorkout" });
  }

  const onChange = (event, selectedDate) => {
    console.log(event)
    // Converts OS date format to javascript date format
    const currentDate = selectedDate || date;
    // Will close the date picker on iOS after selection
    setShow(Platform.OS === 'ios' ? true : false); // Change here
    setDate(currentDate);
    // Convert unix timestamp to string
    const timestamp = currentDate.getTime().toString();
    setTimestamp(timestamp)
    CalculateTime(timestamp);
  };

  // Allows for the activities to be rerendered after navigating to different page
  useFocusEffect(
    React.useCallback(() => {
      GetActivitiesFromWorkout();
    }, [])
  );
  if (user) {
    
    return (
      // Background to be replicated across page
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Top Navigation Bar with Logout and Create Activity buttons */}
          <View style={styles.topBar}>
            <Text style={styles.header}>Create Workout</Text>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={() => navigation.navigate('Workouts')} image={require('../../assets/Back.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            
          </View>

          {/* Container for all Activity widgets with scrollable content box */}
          
          <View style={styles.innerContainer}>
            <Text style={{...styles.header2, marginTop: 5}}>Workout Date</Text>
            {(show || Platform.OS === 'ios') && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            {Platform.OS === 'android' && (
              <StyledButton title={stringStamp} onPress={() => setShow(true)} style={{ backgroundColor: '#514eb5', width: 'auto', height: 50, margin: 20, borderRadius: 10 }} fontSize={19}/>
              
            )}
            {/* Iterate through all workout activities and create widgets in a scrollable list */}
            <Text style={styles.header2}>Workout Activities</Text>
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: (340 * createWorkoutActivities.length) + 320, minHeight: (340 * createWorkoutActivities.length) + 320}}>
              <AddWidget key={1} onPress={() => AddActivity()} />
              {[...createWorkoutActivities].reverse().map((activityItem, index) => (
                <WorkoutActivityWidget key={index} onPress={() => Manage(activityItem, index)} activity={activityItem.activity} duration={activityItem.duration} buttonText={"Manage"} />
              ))}
            </ScrollView>
          </View>
          <SubmitBar onPress={Create} buttonText={"Create"} />
        </ImageBackground>
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
    flexDirection: 'column',
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
    flex: 1,
    fontSize: 29,
    fontWeight: '800',
    marginBottom: 50,
    color: '#2f2f2f',
    textAlign: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 58,
  },
  header2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 30,
    color: '#2f2f2f',
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 5,
  },
  
});