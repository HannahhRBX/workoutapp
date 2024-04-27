// Local Storage for User Data
import AsyncStorage from '@react-native-async-storage/async-storage';

// Retrieve user table from local storage JSON format
export const retrieveUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if(user !== null) {
      return JSON.parse(user);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

