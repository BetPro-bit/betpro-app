// Web shim for expo-secure-store
// Falls back to AsyncStorage on web since SecureStore is native-only
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItemAsync(key) {
  return AsyncStorage.getItem(key);
}

export async function setItemAsync(key, value) {
  return AsyncStorage.setItem(key, value);
}

export async function deleteItemAsync(key) {
  return AsyncStorage.removeItem(key);
}

export default { getItemAsync, setItemAsync, deleteItemAsync };
