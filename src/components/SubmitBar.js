import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import NavItem from './NavItem';
import { StyledButton } from './StyledButton';

// Submit Button Bottom Bar Element
export default function SubmitBar({ onPress }) {
  // Handler for changing pages and setting state of current tab
  

  
  return (
    // Navigation bar image background with Home, Workouts and Activity buttons
    <ImageBackground source={require('../../assets/BarBackground.png')} style={styles.navBar}>
      <StyledButton title="Create" onPress={onPress} style={{ backgroundColor: '#514eb5', width: 230, height: 50, margin: 20 }} fontSize={20} />
    </ImageBackground>
  );
}

// Custom styling for elements
const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    borderTopColor: '#e0e0e0',
    shadowColor: '#868686',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  navText: {
    color: '#b6b6b6',
    fontWeight: '400',
  },
  navTextSelected: {
    color: '#514eb5',
    fontWeight: '600',
  },
});