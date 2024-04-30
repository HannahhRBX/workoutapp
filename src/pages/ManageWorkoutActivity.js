import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';
import { CreateWorkoutActivityContext } from '../../CreateWorkoutActivityContext';
import { FormatDuration } from '../functions/FormatDuration';
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from 'expo-linear-gradient';

// Manage Activity Page
export default function ManageWorkoutActivity({ navigation }) {
  const route = useRoute();
  // Get user from route params
  let user = route.params?.user || null;
  // Get id, name and description from route params
  let { workoutID = null, activityID = null, duration: initialDuration = 0, activity: initialActivity = [] } = route.params?.workoutActivity || {};
  let index = route.params?.index || 0;
  let redirect = route.params?.redirect || 'Workouts';
  //console.log(id, workoutID, activityID, initialDuration, initialActivity);
  let [duration, setDuration] = useState(initialDuration);
  let [formattedDuration, setFormattedDuration] = useState(FormatDuration({ duration: initialDuration }));
  const [createWorkoutActivities, setCreateWorkoutActivities] = useContext(CreateWorkoutActivityContext);
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(0);

  // Submit activity changes to context state
  const Submit = async () => {
    console.log(createWorkoutActivities, duration, index, redirect)
    try {
      // Update the workoutActivity at the specified index
      const newWorkoutActivities = createWorkoutActivities.map((activity, activityIndex) => {
        if (activityIndex === index) {
          return { activity: initialActivity, duration: duration, activityID: activityID, id: activity.id};
        }
        return activity;
      });

      // Update the state
      setCreateWorkoutActivities(newWorkoutActivities);
      navigation.navigate(redirect, { workout: route.params.workout });
      // If successful, navigate back to activities page


      
    } catch (error) {
      console.error('Failed to update the activity:', error);
    }
  };

  // Delete Activity in workout useContext
  const Delete = async () => {
    try {
      // Remove workoutActivity at specified index
      const newWorkoutActivities = createWorkoutActivities.filter((_, activityIndex) => activityIndex !== index);

      // Update state and send back to create workout page
      setCreateWorkoutActivities(newWorkoutActivities);
      navigation.navigate(redirect, { workout: route.params.workout });
      
    }catch (error) {
      console.error('Failed to delete the activity:', error);
    }
  };
  
  if (user) {
    return (
      // Background to be replicated across app
      <ImageBackground source={Background} style={styles.container}>
        {/* Element to allow tapping on background to close keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={() => navigation.navigate(redirect, { workout: route.params.workout })} image={require('../../assets/Back.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.topRightButton}>
              <StyledButton title="" onPress={Delete} image={require('../../assets/Plus.png')} style={{ backgroundColor: '#e83f32', width: 50, height: 50, margin: 20, transform: [{ rotate: '45deg' }] }} fontSize={25}/>
            </View>
            {/* Form and buttons for navigation */}
            <View style={styles.innerContainer}>
              <Text style={styles.header}>{initialActivity.name}</Text>
              <Text style={styles.header2}>{initialActivity.description}</Text>
              <Text style={styles.header3}>Duration: {formattedDuration}</Text>
              <StyledButton title="Change Duration" onPress={() => { setShowPicker(true)}} style={{ backgroundColor: '#514eb5', width: 200, height: 45, margin: 20, marginTop: -25, borderRadius: 10 }} fontSize={20} />
              <StyledButton title="Save Changes" onPress={Submit} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20, marginTop: 50 }} fontSize={20} />
            </View>
            
          </View>
          
        </TouchableWithoutFeedback>
        <TimerPickerModal
              visible={showPicker}
              hideSeconds
              setIsVisible={setShowPicker}
              onConfirm={(pickedDuration) => {
                  setShowPicker(false);
                  setDuration((pickedDuration.hours * 60) + pickedDuration.minutes);
                  setFormattedDuration(FormatDuration({ duration: (pickedDuration.hours * 60) + pickedDuration.minutes }));
              }}
              modalTitle="Activity Duration"
              onCancel={() => setShowPicker(false)}
              closeOnOverlayPress
              LinearGradient={LinearGradient}
              
              styles={{
                  theme: "light",
                  button: {
                    fontWeight: 'bold',
                  }
              }}
              modalProps={{
                  overlayOpacity: 0.8,
              }}
            />
      </ImageBackground>
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
  title: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -7,
    marginTop: 5,
    width: 300,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
  },
  innerContainer: {
    height: '50%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  input2: {
    height: 150,
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
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 10,
    width: '90%',
    textAlign: 'center',
  },
  header2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    marginTop: 10,
    color: '#2f2f2f',
    width: '90%',
    textAlign: 'center',
  },
  header3: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    marginTop: 10,
    color: '#2f2f2f',
    width: '90%',
    textAlign: 'center',
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 1,
  },
  topRightButton: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 5,
  },
});