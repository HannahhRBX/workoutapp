import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput} from 'react-native';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Background from '../../assets/Background2.png';
import { useRoute } from '@react-navigation/native';

// Create Activity Page
export default function CreateActivity({ navigation }) {
  const route = useRoute();
  // Get user from route params
  let user = route.params?.user || null;
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  
  // Create activity through API
  const CreateActivity = async () => {
    const data = {
      userID: user.id,
      name: name,
      type: type,
      description: description,
    };
    const response = await fetch('https://workoutapi20240425230248.azurewebsites.net/api/activities', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let result = await response.json();
    
    if(response.ok) {
      // If response ok, navigate back to activities page
      navigation.navigate('Activities');
    }
  }

  
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
            {/* Form and buttons for navigation */}
            <View style={styles.innerContainer}>
              <Text style={styles.header}>Create Activity</Text>

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

              <StyledButton title="Create" onPress={CreateActivity} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20 }} fontSize={20} />
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
    marginBottom: 50,
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 1,
  },
});