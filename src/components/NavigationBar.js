import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import NavItem from './NavItem';

// Navigation Bar Element
export default function NavigationBar({ onSelect, currentPage }) {
  const [selectedTab, setSelectedTab] = useState(currentPage);

  // Handler for changing pages and setting state of current tab
  const handlePress = (tab) => {
    setSelectedTab(tab);
    onSelect(tab);
  };

  useEffect(() => {
    setSelectedTab(currentPage);
  }, [currentPage]);
  
  return (
    // Navigation bar image background with Home, Workouts and Activity buttons
    <ImageBackground source={require('../../assets/BarBackground.png')} style={styles.navBar}>
      <NavItem handlePress={handlePress} selectedTab={selectedTab} imageSource={require('../../assets/Home.png')}itemName='Home' styles={styles} />
      <NavItem handlePress={handlePress} selectedTab={selectedTab} imageSource={require('../../assets/Workouts.png')} itemName='Workouts' styles={styles} />
      <NavItem handlePress={handlePress} selectedTab={selectedTab} imageSource={require('../../assets/Activities.png')} itemName='Activities' styles={styles} />
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