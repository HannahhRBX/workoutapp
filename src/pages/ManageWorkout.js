import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
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
import uuid from 'react-native-uuid';

// Create Workout Page
export default function ManageWorkout({ navigation }) {
  const route = useRoute();
  let user = route.params?.user || null;
  let { id, timestamp: initialTimestamp = '', userID, workoutActivities: initialWorkoutActivities = [] } = route.params?.workout || {};

  const [createWorkoutActivities, setCreateWorkoutActivities] = useContext(CreateWorkoutActivityContext);
  
  const [timestamp, setTimestamp] = useState(initialTimestamp);
  const [date, setDate] = useState(new Date(Number(timestamp)));
  const [show, setShow] = useState(false);
  const [stringStamp, setStringStamp] = useState('Select Date');
  console.log(id,userID,timestamp);
  

  const CalculateTime = (time) => {
    const timestampInt = parseInt(time, 10);
    const dateFromTimestamp = new Date(timestampInt);
    // Split date into weekday, day, month, and year
    const day = dateFromTimestamp.toLocaleDateString('en-US', { day: '2-digit' });
    const month = dateFromTimestamp.getMonth() + 1; // Months are 0-based in JavaScript
    const year = dateFromTimestamp.toLocaleDateString('en-US', { year: 'numeric' });
    setStringStamp(`${day}/${month < 10 ? '0' + month : month}/${year}`);
  }
  // Delete user from local storage and navigate to welcome page
  

  const AddActivity = async () => {
    navigation.navigate('AddActivities', {
      
      redirect:"ManageWorkout",
      workout: route.params.workout,
    });
  };

  const UpdateWorkoutActivities = async () => {
       
    // GET request to retrieve the workout info from server
    const response = await fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    });
    // If response ok, compare the workout from server to the workout in state
    if (response.ok){
      const data = await response.json();
      const serverWorkoutActivities = data.workoutActivities;
      const stateWorkoutActivities = createWorkoutActivities;
      const workoutID = data.id;
      console.log("Workout DATA: ",serverWorkoutActivities);
      console.log("\nState DATA: ",stateWorkoutActivities);

      // If the server workout has activities
      if (data.workoutActivities){
        // Function to check if server has activities that client does not
        serverWorkoutActivities.forEach(serverActivity => {
          // If the server activity is not in the state activities, delete the activity from the server
          const stateActivity = stateWorkoutActivities.find(stateActivity => stateActivity.id === serverActivity.id);
          if (!stateActivity) {
            // Send DELETE request
            console.log("DELETING: ", serverActivity.id);
            fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/activity/${serverActivity.id}`, {
              method: 'DELETE',
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log(`Deleted activity with id ${serverActivity.id}`);
            })
          } else {
            // Send PUT request to update the workoutActivity data
            console.log("UPDATING: ", serverActivity.id, stateActivity.duration, stateActivity.activityID);
            fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/activity/${serverActivity.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: stateActivity.id,
                workoutID: workoutID,
                activityID: stateActivity.activityID,
                duration: stateActivity.duration,
                
                
              }),
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log(`Updated activity with id ${serverActivity.id}`);
            })
          }
        });
      }

      // Function to check if state has activities that the server does not
      stateWorkoutActivities.forEach(stateActivity => {
        // If the state activity is not in the server activities, create the activity on the server
        const serverActivity = serverWorkoutActivities.find(serverActivity => serverActivity.id === stateActivity.id);
        if (!serverActivity) {
          // Send POST request to create new workoutActivity
          console.log("CREATING: ", stateActivity.duration, stateActivity.activity.id);
          fetch('https://workoutapi20240425230248.azurewebsites.net/api/workouts/activity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                workoutID: workoutID,
                activityID: stateActivity.activity.id,
                duration: stateActivity.duration,
              
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log(`Created workout activity with activity id ${stateActivity.activity.id} and workout id ${workoutID}`);
          })
        }
      });
      
      navigation.navigate('Workouts');
    };
  }

  console.log(createWorkoutActivities)
  // Function to delete the workout and its workoutActivities
  const DeleteWorkout = async () => {
    // Delete workoutActivities
    
    createWorkoutActivities.forEach(workoutActivity => {
      console.log("DELETING ACTIVITY: ", workoutActivity.id);
      fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/activity/${workoutActivity.id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(`Deleted activity with id ${workoutActivity.id}`);
      })
    });

    // Delete workout
    console.log("DELETING WORKOUT: ", id);
    fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(`Deleted workout with id ${id}`);
    })
    navigation.navigate('Workouts');
  }


  // Update a workout with new timestamp and its activities
  UpdateWorkout = async () => {
    try{
      // Catch form validation for empty timestamp
      if (timestamp == ''){
        alert('Please select a date for the workout');
        return;
      }
      // PUT request to update workout info on server
      const response = await fetch(`https://workoutapi20240425230248.azurewebsites.net/api/workouts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            id,
          },
          body: JSON.stringify({
            id,
            userID,
            timestamp,
          }),
      });
      // If response ok, create workout activities using newly created workout ID
      if (response.ok){  
        console.log(id);
        UpdateWorkoutActivities();
        
      }else{
        // If response not ok, alert user
        const data = await response.json();
        console.log(data);
        alert('Failed to create workout',id);
      };
    }catch (error){
      console.error('Failed to update the workout:', error);
    }
  };

  
  const Manage = async (workoutActivity, index) => {
    
    navigation.navigate('ManageWorkoutActivity', { workoutActivity, index, redirect:"ManageWorkout", workout: route.params.workout });
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

  // Only run on page load to get workout Date
  useEffect(() => {
    CalculateTime(timestamp);
  }, []);
  
  
  if (user) {
    
    return (
      // Background to be replicated across page
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Top Navigation Bar with Logout and Create Activity buttons */}
          <View style={styles.topBar}>
            <Text style={styles.header}>Manage Workout</Text>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={() => navigation.navigate('Workouts')} image={require('../../assets/Back.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.topRightButton}>
              <StyledButton title="" onPress={DeleteWorkout} image={require('../../assets/Plus.png')} style={{ backgroundColor: '#e83f32', width: 50, height: 50, margin: 20, transform: [{ rotate: '45deg' }] }} fontSize={25}/>
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
              {createWorkoutActivities.map((activityItem, index) => (
                <WorkoutActivityWidget key={index} onPress={() => Manage(activityItem, index)} activity={activityItem.activity} duration={activityItem.duration} buttonText={"Manage"} />
              ))}
              
            </ScrollView>
          </View>
          <SubmitBar onPress={UpdateWorkout} buttonText={"Update"} />
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
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 50,
    color: '#2f2f2f',
    textAlign: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 59,
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
  topRightButton: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 5,
  },
});