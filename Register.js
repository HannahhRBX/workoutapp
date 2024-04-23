import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { StyledButton } from './src/StyledButton';


// Registration Page
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    // Form and buttons for navigation
    <View style={styles.container}>
      <View style={styles.topLeftButton}>
        <StyledButton title="" onPress={login} image={require('./assets/Back.png')} style={{ backgroundColor: '#514eb5', width: 50, height: 50, margin: 20 }} fontSize={25}/>
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
        <StyledButton title="Login" onPress={login} style={{ backgroundColor: '#514eb5', width: 150, height: 45, margin: 20 }} fontSize={20} />
        
      </View>
      
    </View>
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
  },
});