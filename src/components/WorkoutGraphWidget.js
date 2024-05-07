import React, { useRef } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Workout Graph Widget
export default function WorkoutGraph({ workouts, days }) {
  const screenWidth = Dimensions.get('window').width;
  const hasLoggedNoData = React.useRef(false);

  
  // Get timestamp for 'days' days ago
  const daysAgo = Date.now() - days * 24 * 60 * 60 * 1000;
  const now = Date.now();
  // Filter workouts for past 'days' days
  const pastDaysWorkouts = workouts
    .filter(workout => workout.timestamp >= daysAgo && workout.timestamp <= now)
    .sort((a, b) => a.timestamp - b.timestamp);
  
  // Check to see if there are any workouts after applying timestamp filters
  if (!pastDaysWorkouts || pastDaysWorkouts.length === 0) {
    if (!hasLoggedNoData.current) {
      console.log('No data available');
      hasLoggedNoData.current = true;
    }
    if (days == 7){
      return (
        <Text style={styles.emptyTitle}>No Statistics to Display.</Text>
      );
    }else{
      return;
    }
    
  } else {
    hasLoggedNoData.current = false;
  }

  // Get total workout time for each day
  const data = pastDaysWorkouts.map(workout => {
    const totalDuration = workout.workoutActivities.reduce((total, activity) => total + activity.duration, 0) / 60;
    return totalDuration;
  });
  //console.log(pastDaysWorkouts)
  const isValidData = data.every(Number.isFinite);

  

  // Get date for 'days' days ago
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const daysAgoDate = `${day}/${month}`;
  let textLabel = days + ' day';
  if (days === 7) {
    textLabel = 'weekly';
  }
  
  let previousLabel = null;
  return (
    
  <View style={styles.activityWidget}>
      <View style={styles.innerWidget}>
      <View style={{borderRadius: 10, backgroundColor: '#ffffff', width: '100%', height: '300', paddingBottom: -10, paddingTop:30, justifyContent:'center', alignItems:'center', alignContent:'center', marginBottom: 20 }}>
        <Text style={{...styles.activityHeader, paddingBottom: 20, padding:15}}>Here's your {textLabel} summary.</Text>
            <View style={{ alignSelf: 'flex-start', paddingLeft: 28, marginBottom: -25 }}>
              <Text style={{...styles.activityHeader, fontSize: 18}}>Hours</Text>
            </View>
            <LineChart
              data={{
                labels: [daysAgoDate, '','','', 'Today'],
                datasets: [{
                  data: data}]
                }}
                width={screenWidth}
                height={220}
                bezier
                yAxisInterval={1}
                formatYLabel= {(label) => {
                  if (label === previousLabel) {
                    return '';
                  } else {
                    previousLabel = label;
                    return label;
                  }
                }}
                chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                fromZero: true,
                yAxisInterval: 1,
                color: (opacity = 1) => "#514eb5",
                labelColor: (opacity = 1) => "#000000",
                style: {
                  borderRadius: 16
                },
                propsForLabels: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  padding: 5,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '10 10',
                  strokeWidth: 0.2,
                },
                
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                padding: 10,
              }}
            />
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
    height: 350,
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
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 20,
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
  emptyTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#2f2f2f',
    textAlign: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 45,
  },
});