import React, { useRef } from 'react';
import { Dimensions, View, Text, StyleSheet, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Workout Average Widget
export default function WorkoutAverage({ workouts, days }) {
  
  const hasLoggedNoData = React.useRef(false);
  const daysAgo = Date.now() - days * 24 * 60 * 60 * 1000;
  const now = Date.now();
  // Filter the workouts for the past 'days' days
  const pastDaysWorkouts = workouts
    .filter(workout => workout.timestamp >= daysAgo && workout.timestamp <= now)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Check to see if there are any workouts after applying timestamp filters
  if (!pastDaysWorkouts || pastDaysWorkouts.length === 0) {
    if (!hasLoggedNoData.current) {
      console.log('No data available');
      hasLoggedNoData.current = true;
    }
    return;
  } else {
    hasLoggedNoData.current = false;
  }

  // Adds up total duration of all workouts in period
  let totalDuration = 0;
  pastDaysWorkouts.forEach(workout => {
    totalDuration += workout.workoutActivities.reduce((total, activity) => total + activity.duration, 0);
  });

  // Calculates average duration per day
  const averageDuration = (totalDuration / (60 * days)).toFixed(1);
  let textLabel = days + ' Day';
  if (days === 7) {
    textLabel = 'Weekly';
  }
  return (
    
    <View style={styles.activityWidget}>
      <View style={styles.innerWidget}>
        <View style={{
          borderRadius: 10, 
          backgroundColor: '#ffffff', 
          width: '100%', 
          height: '100', 
          paddingBottom: -10, 
          paddingTop:30, 
          justifyContent:'center', 
          alignItems:'center', 
          alignContent:'center', 
          marginBottom: 20, 
          flexDirection: 'row',
        }}>
          <Image source={require('../../assets/Stats.png')} style={styles.image} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{...styles.activityHeader, paddingBottom: 0, padding:15}}>{textLabel} Average</Text>
            <Text style={{...styles.activityHeader2, paddingBottom: 20, padding:15}}>{averageDuration} Hours/day</Text>
          </View>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  activityWidget: {
      
    alignItems: 'center',
    justifyContent: 'center',
    
    zIndex: 2,
    backgroundColor: '#ffffff', 
    width:'95%',
    minWidth:'95%', 
    height: 130,
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
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 7,
    marginBottom: -5,
    maxWidth: '75%',
    minWidth: '75%',
    textAlign: 'center',
  },
  activityHeader2: {
    fontSize: 21,
    fontWeight: '500',
    marginLeft: 7,
    marginBottom: 5,
    maxWidth: '75%',
    minWidth: '75%',
    textAlign: 'center',
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
  image: {
    padding: 5,
    resizeMode: 'contain',
    marginBottom: 13,
    maxWidth: '20%',
    minWidth: '20%',
    marginLeft: 40,
  },
});