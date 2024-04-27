import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import NavItem from './NavItem';

export default function NavigationBar({ onSelect, currentPage }) {
  const [selectedTab, setSelectedTab] = useState(currentPage);

  const handlePress = (tab) => {
    setSelectedTab(tab);
    onSelect(tab);
  };

  useEffect(() => {
    setSelectedTab(currentPage);
  }, [currentPage]);
  
  return (
    <View style={styles.navBar}>

      <NavItem handlePress={handlePress} selectedTab={selectedTab} imageSource={require('../../assets/Home.png')} height={33} itemName='Home' styles={styles} />
      <NavItem handlePress={handlePress} selectedTab={selectedTab} imageSource={require('../../assets/Workouts.png')} height={38} itemName='Workouts' styles={styles} />
      <NavItem handlePress={handlePress} selectedTab={selectedTab} imageSource={require('../../assets/Activities.png')} height={33} itemName='Activities' styles={styles} />
    
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    paddingTop: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 0, // Add a border to the top
    borderTopColor: '#e0e0e0', // Set the border color
    shadowColor: '#868686', // Set the shadow color
    shadowOffset: { width: 0, height: -2 }, // Set the shadow offset to create a shadow at the top
    shadowOpacity: 0.25, // Set the shadow opacity
    shadowRadius: 4.84, // Set the shadow radius
    elevation: 5, // This is necessary for Android to display the shadow
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