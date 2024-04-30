import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, navigation } from '@react-navigation/stack';

import SelectedTabContext from './SelectedTabContext';
import { CreateWorkoutActivityContext } from './CreateWorkoutActivityContext';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Welcome from './src/pages/Welcome';
import Home from './src/pages/Home';
import Workouts from './src/pages/Workouts';
import CreateWorkout from './src/pages/CreateWorkout';
import ManageWorkout from './src/pages/ManageWorkout';
import AddActivities from './src/pages/AddActivities';
import Activities from './src/pages/Activities';
import ManageActivity from './src/pages/ManageActivity';
import CreateActivity from './src/pages/CreateActivity';
import { retrieveUser } from './src/Storage';
import ManageWorkoutActivity from './src/pages/ManageWorkoutActivity';



const Stack = createStackNavigator();

// Main App
export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [selectedTab, setSelectedTab] = useState('Home');
  const [createWorkoutActivities, setCreateWorkoutActivities] = useState([]);

  

  useEffect(() => {
    const fetchUser = async () => {
      const retrievedUser = await retrieveUser();
      if (retrievedUser) {
        setUser(retrievedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);
  console.log("User: ",user)
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    // Navigation to render various pages
    <>
    <CreateWorkoutActivityContext.Provider value={[ createWorkoutActivities, setCreateWorkoutActivities ]}>
    <SelectedTabContext.Provider value={{ selectedTab, setSelectedTab }}>
    <NavigationContainer>
      {user ? (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          {/* The screens to show when the user is logged in */}
          <Stack.Screen name="Home" component={Home} options={{animationEnabled: false}} initialParams={{ user: user }} />
          <Stack.Screen name="Workouts" component={Workouts} options={{animationEnabled: false}} initialParams={{ user: user }} />
          <Stack.Screen name="CreateWorkout" component={CreateWorkout} initialParams={{ user: user }} />
          <Stack.Screen name="ManageWorkout" component={ManageWorkout} initialParams={{ user: user }} />
          <Stack.Screen name="ManageWorkoutActivity" component={ManageWorkoutActivity} initialParams={{ user: user }} />
          <Stack.Screen name="AddActivities" component={AddActivities} initialParams={{ user: user }} />
          <Stack.Screen name="Activities" component={Activities} options={{animationEnabled: false}} initialParams={{ user: user }} />
          <Stack.Screen name="CreateActivity" component={CreateActivity} initialParams={{ user: user }} />
          <Stack.Screen name="ManageActivity" component={ManageActivity} initialParams={{ user: user }} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          {/* ...other screens... */}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          {/* The screens to show when the user is not logged in */}
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
    </SelectedTabContext.Provider>
    </CreateWorkoutActivityContext.Provider>
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#eee',
    padding: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    color: '#777',
  },
  navTextSelected: {
    color: '#000',
  },
});