import React, { useState } from 'react';
import { StyleSheet, Text, Image, View, Button, TextInput } from 'react-native';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';


// Welcome Page before Login/Registation
export default function Welcome({ navigation }) {

  // Send login function to API
  const login = async () => {
    let data = {
      email: email,
      password: password
    };
    // Get login response from API
    const response = await fetch('https://localhost:7267/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(response.ok) {
      const result = await response.json();
      console.log("Login successful",result);
    } else {
      // handle error
      console.log(response.status)
    }
  }

  return (
    // Background to be replicated across app
    <ImageBackground source={Background} style={styles.container}>
      {/* Form and buttons for navigation */}
      <View style={styles.container}>
        
        <View style={styles.innerContainer}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <Text style={styles.header}>Welcome to KeepFit</Text>
        <Text style={styles.body}>Stronger you starts now! 💪</Text>
        
        <StyledButton title="Create an Account" onPress={() => navigation.navigate('Register')} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20 }} fontSize={20} />
        <Text style={styles.body2}>Already a member?</Text>
        <StyledButton title="Login" onPress={() => navigation.navigate('Login')} style={{ backgroundColor: '#514eb5', width: 230, height: 50, marginTop: 20, marginBottom:70 }} fontSize={20} />
        
          
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
    fontSize: 33,
    fontWeight: '700',
    marginBottom: 3,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 20,
    width: 330,
    textAlign: 'center',
  },
  body2: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: -10,
    width: 330,
    textAlign: 'center',
    marginTop: 20,
  },
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
  },
  logo: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
    marginBottom: 50,
  },
});