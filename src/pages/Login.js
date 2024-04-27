import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';
import AsyncStorage from '@react-native-async-storage/async-storage';



// Login Page
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  // Send login function to API
  const login = async () => {
    try{
      let data = {
        email: email,
        password: password
      };
      // Get login response from API
      const response = await fetch('https://workoutapi20240425230248.azurewebsites.net/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(response.ok) {
        const result = await response.json();
        console.log("Login successful",result);

        // Store the result object in local storage
        try {
          await AsyncStorage.setItem('user', JSON.stringify(result));
          navigation.navigate('Home', { user: result });
        } catch (e) {
          // handle error
          setErrorText(e);
        }
      } else {
        // handle error
        setErrorText("Invalid email or password");
      }
    }catch (error){
      setErrorText(error.message);
    }
  }

  return (
    // Background to be replicated across app
    <ImageBackground source={Background} style={styles.container}>
      {/* Form and buttons for navigation */}
      <View style={styles.container}>
        <View style={styles.topLeftButton}>
          <StyledButton title="" onPress={() => navigation.navigate('Welcome')} image={require('../../assets/Back.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
        </View>
        <View style={styles.innerContainer}>
        <Text style={styles.header}>Login</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry
          />
          <Text style={styles.error}>{errorText}</Text>
          <StyledButton title="Login" onPress={login} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20 }} fontSize={20} />
          
        </View>
        
      </View>
    </ImageBackground>
  );
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
  header: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 20,
  },
  error: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 0,
    color: 'red',
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 1,
  },
});