import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StyledButton } from './StyledButton';

const AddWidget = ({ onPress }) => {
  return (
    <View style={styles.activityWidget}>
      <View style={styles.innerWidget}>
        
        <StyledButton title="" image={require('../../assets/Plus2.png')} onPress={() => onPress()} style={{ backgroundColor: '#514eb5', width: '100%', height: '100%', borderRadius: 8}} fontSize={20} />
      </View>
    </View>
  );
};

export default AddWidget;

const styles = StyleSheet.create({
  activityWidget: {
      
    alignItems: 'center',
    justifyContent: 'center',
    
    zIndex: 2,
    backgroundColor: 'transparent', 
    width:'90%',
    minWidth:'90%', 
    height: 60,
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
    backgroundColor: 'transparent', 
    height: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 11,
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