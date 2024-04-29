import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';

// Navigation Bar Item Image with Title
export default NavItem = ({ handlePress, selectedTab, imageSource, itemName, styles }) => (
  <View style={styles.navItem}>
    <TouchableOpacity onPress={() => handlePress(itemName)} style={{  alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={imageSource}
        style={{
          tintColor: selectedTab === itemName ? '#514eb5' : '#b6b6b6',
          width: '100%',
          height: 44,
          aspectRatio: 1,
          marginBottom: -5,
        }}
        resizeMode='contain'
      />
      <Text style={selectedTab === itemName ? styles.navTextSelected : styles.navText}>{itemName}</Text>
    </TouchableOpacity>
  </View>
);
