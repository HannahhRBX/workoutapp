import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';
import WorkoutGraph from '../components/WorkoutGraphWidget';
import WorkoutAverage from '../components/WorkoutAverageWidget';
import WorkoutPieChart from '../components/WorkoutPieChartWidget';

// Registration Page
export default function Home({ navigation }) {
  const route = useRoute();
  let user = route.params?.user || null;
  const { selectedTab, setSelectedTab } = useContext(SelectedTabContext);
  const [workouts, setWorkouts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  
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
  if (user && workouts.length > 0) {
    
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
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: 2200, minHeight: 2200, width: 370}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
              <WorkoutGraph workouts={workouts} days={7} />
              <WorkoutAverage workouts={workouts} days={7} />
              <WorkoutPieChart workouts={workouts} days={7} />
              <WorkoutGraph workouts={workouts} days={30} />
              <WorkoutAverage workouts={workouts} days={30} />
              <WorkoutPieChart workouts={workouts} days={30} />

            </ScrollView>
          </View>
      </ImageBackground>
      <NavigationBar onSelect={navigation.navigate} currentPage={selectedTab} />
      </>
    );
  }else{
    
    return (
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
            <ScrollView contentContainerStyle={{...styles.widgetContainer, height: (830 ) + 500, minHeight: (830) + 500, width: 370}}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
              <Text style={styles.emptyTitle}>No Statistics to Display.</Text>

            </ScrollView>
            
          </View>
        </ImageBackground>
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
    zIndex: 15,
  },
  
});