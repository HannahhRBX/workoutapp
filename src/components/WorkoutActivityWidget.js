import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StyledButton } from './StyledButton';
import { FormatDuration } from '../functions/formatDuration';

// Workout Activity Widget
const WorkoutActivityWidget = ({ activity, duration, onPress, buttonText }) => {
  // Convert duration to hours and minutes
  duration = FormatDuration({ duration: duration });
  
  return (
    // Returns modified Activity Widget alongside duration under text body
    <View style={styles.activityWidget}>
      <View style={styles.innerWidget}>
        <View style={styles.activityTitle}>
          <Text style={styles.activityHeader}>{activity.name}</Text>
          <Text style={styles.activityHeader2}>{activity.type}</Text>
        </View>
        <View style={{height: '39%', width: '100%'}}>
          <Text style={styles.activityBody}>{activity.description}</Text>
        </View>
        <View style={styles.activityTitle2}>
          
          <Text style={styles.activityHeader3}>Duration: {duration}</Text>
        </View>
        <StyledButton title={buttonText} onPress={() => onPress(activity.id)} style={{ backgroundColor: '#514eb5', width: '95%', height: '18%',marginBottom:'3%', borderRadius: 8}} fontSize={20} />
      </View>
    </View>
  );
};

export default WorkoutActivityWidget;

const styles = StyleSheet.create({
  activityWidget: {
      
    alignItems: 'center',
    justifyContent: 'center',
    
    zIndex: 2,
    backgroundColor: '#ffffff', 
    width:'90%',
    minWidth:'90%', 
    height: 300,
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
    height: '25%', 
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
  activityTitle2:{
    height: '15%', 
    width:'100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor:'transparent', 
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
  activityHeader3: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 0,
    width: '100%',
    textAlign: 'center',
    color: '#2d2d2d',
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