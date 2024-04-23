import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';

// Styled Button to allow for uniform cross platform aesthetic
export const StyledButton = ({ onPress, title, style, fontSize, textColor, image }) => {
    
    // Default styling
    const styles = StyleSheet.create({
        button: {
            backgroundColor: '#007BFF',
            padding: 10,
            borderRadius: 1000,
            width: 200,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        text: {
            color: textColor ? textColor : '#fff',
            fontWeight:'700',
        },
        image: {
            width: '80%',
            height: '80%',
            resizeMode: 'contain',
            alignSelf: 'center',
            padding: 0,
            margin: 0,
        },
    });
  return (
    // Only displays text if image is not present
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        {image ? 
            <Image source={image} style={styles.image} /> 
            : 
            <Text style={[styles.text, { fontSize }]}>{title}</Text>
        }
    </TouchableOpacity>
  );
}
