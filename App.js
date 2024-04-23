import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Login';

import { ImageBackground } from 'react-native';
import Background from './assets/Background2.png';


// Main App
export default function App() {
  return (
    // Background to be replicated across app
    <ImageBackground source={Background} style={styles.container}>
        <Login />
        <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#transparent',
    
  },
});