import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StyledButton } from './StyledButton';
import { FormatDuration } from '../functions/FormatDuration';

const WorkoutWidget = ({ workout, onPress, buttonText }) => {
  // Calculate total duration through sum of all activities in workout
  let duration = workout.workoutActivities.reduce((acc, activity) => acc + activity.duration, 0);
  duration = FormatDuration({ duration: duration });
  // Convert duration to hours and minutes
  // Convert unix timestamp string back to int
  const timestampInt = parseInt(workout.timestamp, 10);
  const dateFromTimestamp = new Date(timestampInt);
  // Split date into weekday, day, month, and year
  const weekday = dateFromTimestamp.toLocaleDateString('en-US', { weekday: 'long' });
  const day = dateFromTimestamp.toLocaleDateString('en-US', { day: 'numeric' });
  const month = dateFromTimestamp.toLocaleDateString('en-US', { month: 'long' });
  const year = dateFromTimestamp.toLocaleDateString('en-US', { year: 'numeric' });

  // Add suffix to day
  const dayInt = parseInt(day, 10);
  let suffix = 'th';
  if (dayInt === 1 || dayInt === 21 || dayInt === 31) {
    suffix = 'st';
  } else if (dayInt === 2 || dayInt === 22) {
    suffix = 'nd';
  } else if (dayInt === 3 || dayInt === 23) {
    suffix = 'rd';
  }
  const dayWithSuffix = `${day}${suffix}`;

  return (
    // Widget container
    <View style={styles.activityWidget}>
      <View style={styles.innerWidget}>
        <View style={styles.activityTitle}>
          <Text style={styles.activityHeader}>{weekday}</Text>
          <Text style={styles.activityHeader2}>{dayWithSuffix} {month}, {year}</Text>
        </View>
        <View style={{height: '51%', width: '100%'}}>
          <Text style={styles.activityBody}>Number of Activities: {workout.workoutActivities.length}</Text>
          <Text style={styles.activityBody}>Duration: {duration}</Text>
        </View>
        <StyledButton title={buttonText} onPress={() => onPress(1)} style={{ backgroundColor: '#514eb5', width: '95%', height: '18%',marginBottom:'3%', borderRadius: 8}} fontSize={20} />
      </View>
    </View>
  );
};

export default WorkoutWidget;

const styles = StyleSheet.create({
  activityWidget: {
      
    alignItems: 'center',
    justifyContent: 'center',
    
    zIndex: 2,
    backgroundColor: '#ffffff', 
    width:'90%',
    minWidth:'90%', 
    height: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 5,
    borderRadius: 10,
    margin: 20,
    overflow: 'visible',
    
  },
  innerWidget: {
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    zIndex: 2,
    backgroundColor: '#ffffff', 
    height: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 10,
    margin: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#675379',
  },
  activityTitle:{
    height: '28%', 
    width:'100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor:'#6462b9', 
    borderBottomWidth: 2, 
    borderBottomColor: '#403e84',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 5,
  },
  activityHeader: {
    fontSize: 30,
    fontWeight: '500',
    marginBottom: 0,
    width: '100%',
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: '#373737',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 1,
  },
  activityHeader2: {
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 0,
    width: '100%',
    textAlign: 'center',
    color: '#ffffff',
  },
  activityBody: {
    padding: 10,
    fontSize: 21,
    fontWeight: '400',
    marginBottom: 0,
    width: '100%',
    textAlign: 'left',
    color: '#2d2d2d',
  },
});