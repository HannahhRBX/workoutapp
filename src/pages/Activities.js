import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';

// Registration Page
export default function Activities({ navigation }) {
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

  const manage = async () => {
    navigation.navigate('Manage');
  }

  // Allows for the navigation bar to be rerendered after navigating to a different page
  useFocusEffect(
    React.useCallback(() => {
      setSelectedTab('Activities');
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
              <Text style={styles.header}>Activities</Text>
              <ScrollView contentContainerStyle={styles.widgetContainer}>
                <View style={styles.activityWidget}>
                  <View style={styles.innerWidget}>
                    <View style={styles.activityTitle}>
                      <Text style={styles.activityHeader}>Jumping</Text>
                      <Text style={styles.activityHeader2}>Cardiovascular</Text>
                    </View>
                    <View style={{height: '51%', width: '100%'}}>
                      <Text style={styles.activityBody}>Cardiovascular</Text>
                    </View>
                    <StyledButton title="Manage" style={{ backgroundColor: '#514eb5', width: '95%', height: '18%',marginBottom:'3%', borderRadius: 8}} fontSize={20} />
                  </View>
                </View>
              </ScrollView>
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
    minWidth:'100%',
  },
  
  innerContainer: {
    flex: 1,
    height: '85%',
    minHeight: '85%',
    maxHeight: '85%',
    minWidth:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  widgetContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 500,
    maxWidth: '100%',
    overflow: 'visible',
  },
  
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