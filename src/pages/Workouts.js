import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';

// Registration Page
export default function Workouts({ navigation }) {
  const route = useRoute();
  let user = route.params?.user || null;
  const { selectedTab, setSelectedTab } = useContext(SelectedTabContext);

  // Delete user from local storage and navigate to welcome page
  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('Welcome');
    } catch(e) {
      console.error(e);
    }
  }
  // Allows for the navigation bar to be rerendered after navigating to a different page
  useFocusEffect(
    React.useCallback(() => {
      setSelectedTab('Workouts');
    }, [])
  );
  if (user) {
    
    return (
      // Background to be replicated across app
      <>
        <ImageBackground source={Background} style={styles.container}>
          {/* Form and buttons for navigation */}
          <View style={styles.container}>
            <View style={styles.topLeftButton}>
              <StyledButton title="" onPress={logoutUser} image={require('../../assets/Logout.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.innerContainer}>
            <View style={styles.widgetContainer}>
            <Text style={styles.header}>Hi, {user.firstName}</Text>
            <Text style={styles.header2}>Workouts</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <NavigationBar onSelect={navigation.navigate} currentPage={selectedTab} />
      </>
    );
  }else{
    return (
      <ImageBackground source={Background} style={styles.container}>
        {/* Form and buttons for navigation */}
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
    width:'100%',
  },
  innerContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  widgetContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
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
    fontSize: 35,
    fontWeight: '700',
    marginBottom: 0,
  },
  header2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 5,
  },
});