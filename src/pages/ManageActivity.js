import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import NavigationBar from '../components/NavigationBar';
import SelectedTabContext from '../../SelectedTabContext';

// Manage Activity Page
export default function ManageActivity({ navigation }) {
  const route = useRoute();
  // Get user from route params
  let user = route.params?.user || null;
  // Get id, name and description from route params
  let { id = null, name: initialName = '', type: initialType = '', description: initialDescription = '' } = route.params?.activity || {};

  const [name, setName] = useState(initialName);
  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState(initialDescription);

  // Submit Activity changes to API
  const Submit = async () => {
    try {
        if (user) {
        const response = await fetch(`https://workoutapi20240425230248.azurewebsites.net/api/activities/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            id,
            userID: user.id,
            name,
            type,
            description,
          }),
        });
    
        if (response.ok) {
          // If response ok, navigate back to activities page
          navigation.navigate('Activities');
        }else{
          const data = await response.json();
          console.error('Failed to update the activity:', data);
        }
      }
    } catch (error) {
      console.error('Failed to update the activity:', error);
    }
  };

  // Delete Activity from API
  const Delete = async () => {
    try {
      if (user) {
        const response = await fetch(`https://workoutapi20240425230248.azurewebsites.net/api/activities/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });

        // If response ok, navigate back to activities page
        if (response.ok) {
          navigation.navigate('Activities');
        }
      }
    }
    catch (error) {
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
              <StyledButton title="" onPress={() => navigation.navigate('Activities')} image={require('../../assets/Back.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
            </View>
            <View style={styles.topRightButton}>
              <StyledButton title="" onPress={Delete} image={require('../../assets/Plus.png')} style={{ backgroundColor: '#e83f32', width: 50, height: 50, margin: 20, transform: [{ rotate: '45deg' }] }} fontSize={25}/>
            </View>
            {/* Form and buttons for navigation */}
            <View style={styles.innerContainer}>
              <Text style={styles.header}>{name}</Text>

              <Text style={styles.title}>Name</Text> 
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Name"
                />
                
                <Text style={styles.title}>Type</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setType}
                    value={type}
                    placeholder="Type"
                />
                <Text style={styles.title}>Description</Text>
                <TextInput
                  style={styles.input2}
                  onChangeText={setDescription}
                  value={description}
                  placeholder="Description"
                  multiline={true}
                  numberOfLines={5}
                />
              
              <StyledButton title="Save Changes" onPress={Submit} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20 }} fontSize={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    marginBottom: 20,
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