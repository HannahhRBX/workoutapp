import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StyledButton } from '../components/StyledButton';
import { ImageBackground } from 'react-native';
import Background from '../../assets/Background2.png';

// Registration Page
export default function Register({ navigation }) {
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  // Send login function to API
  const login = async () => {
    let data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    // Get login response from API
    
    const response = await fetch('https://localhost:7267/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    
    if(response.ok) {
      const result = await response.json();
      console.log("Reegistration successful",result);
    } else {
      // handle error
      const result = await response.json();
      console.log(result)
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
        <Text style={styles.header}>Register</Text>
        
          <TextInput
              style={styles.input}
              onChangeText={setfirstName}
              value={firstName}
              placeholder="First Name"
          />
          <TextInput
              style={styles.input}
              onChangeText={setlastName}
              value={lastName}
              placeholder="Last Name"
          />
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
          
          <StyledButton title="Register" onPress={login} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20 }} fontSize={20} />
          
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
  topLeftButton: {
    position: 'absolute',
    top: 30,
    left: 0,
    zIndex: 1,
  },
});