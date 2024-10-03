import React, { useEffect, useState } from "react";
import { useDarkMode } from '../context/DarkModeContext';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import getUserById from "../services/getUserById";
import { styles } from "../styles/styles";
import { getProfilePictureUrlByUserId } from "../backend/community";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALWAYS_THIS_DEVICE_ONLY } from "expo-secure-store";
import { supabase } from "../services/supabase";


export default function PublicProfileScreen({ route, navigation }) {
  const { user_id } = route.params;
  const { isDarkMode } = useDarkMode();
  const [user, setUser] = useState();
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      fetchedUser = await getUserById(user_id);
      setUser(fetchedUser);
    };

    const fetchProfilePictureUrl = async () => {
      const url = await getProfilePictureUrlByUserId(user_id);
      setProfilePictureUrl(url);
    };

    fetchUser();
    fetchProfilePictureUrl();
  }, [user_id])

  const getProfilePictureUrlByUserId = async (user_id) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('profilepicture_url')
        .eq('user_id', user_id)
        .single();

      if (error) {
        console.error('Error fetching profile picture URL:', error);
        return null;
      }

      console.log(data.profilepicture_url);
      return data ? data.profilepicture_url : null;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }

  }


  return (
    <TouchableWithoutFeedback onPress={() => {
      // Schließt die Tastatur, wenn der Benutzer außerhalb der Eingabefelder tippt
      Keyboard.dismiss();
      setShowVisitedInput(false);
      setShowWishListInput(false);
    }}>
      <ScrollView style={[styles.containerProfileScreen, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
        <View style={[styles.profileSection, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
          <Image
            source={{ uri: profilePictureUrl }}
            style={styles.profileImage}
          />
          <Text style={[styles.name, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>{user.username}</Text>
          <Text style={[styles.details, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>{user.email}</Text>
          <View style={styles.row}>
            <Icon name="birthday-cake" size={14} style={[styles.iconRightMargin, { color: isDarkMode ? '#FFFDF3' : '#000000' }]} />
            <Text style={[styles.details, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
              {user.birthday ? user.birthday : 'No birthdate configured'}
            </Text>
          </View>
          <View style={styles.row}>
            <Flag code="DE" size={16} style={styles.iconRightMargin} />
            <Text style={[styles.details, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>Deutschland</Text>
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.header}>Bereits besuchte Länder:</Text>
          {visitedCountries.length === 0 ? (
            <Text style={styles.details}>Keine besuchten Länder hinzugefügt</Text>
          ) : (
            visitedCountries.map((country, index) => (
              <View key={index} style={styles.countryItem}>
                <View style={styles.countryTextContainer}>
                  <Text style={styles.details}>{country.name}</Text>
                  {country.verified && <Icon name="check-circle" size={16} color="green" style={styles.verifiedIcon} />}
                </View>
                <TouchableOpacity onPress={() => removeVisitedCountry(index)} style={styles.removeButton}>
                  <Icon name="trash" size={20} color="#FFFDF3" />
                </TouchableOpacity>
              </View>
            ))
          )}
          {showVisitedInput && (
            <>
              <TextInput
                style={styles.input}
                onChangeText={setNewVisited}
                value={newVisited}
                placeholder="Neues Ziel hinzufügen"
                placeholderTextColor="#cccccc"
              />
              <Button onPress={addVisitedCountry} color="#58CFEC">Hinzufügen</Button>
            </>
          )}
          {!showVisitedInput && (
            <TouchableOpacity onPress={() => setShowVisitedInput(true)} style={styles.addButton}>
              <Icon name="plus" size={20} color="#FFFDF3" />
              <Text style={styles.addButtonText}> Besuchtes Land hinzufügen</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.header}>Wunschreiseziele:</Text>
          {wishListCountries.length === 0 ? (
            <Text style={styles.details}>Keine Wunschziele hinzugefügt</Text>
          ) : (
            wishListCountries.map((country, index) => (
              <View key={index} style={styles.countryItem}>
                <Text style={styles.details}>{country}</Text>
                <TouchableOpacity onPress={() => removeWishListCountry(index)} style={styles.removeButton}>
                  <Icon name="trash" size={20} color="#FFFDF3" />
                </TouchableOpacity>
              </View>
            ))
          )}
          {showWishListInput && (
            <>
              <TextInput
                style={styles.input}
                onChangeText={setNewWishList}
                value={newWishList}
                placeholder="Neues Wunschziel hinzufügen"
                placeholderTextColor="#cccccc"
              />
              <Button onPress={addWishListCountry} color="#58CFEC">Hinzufügen</Button>
            </>
          )}
          {!showWishListInput && (
            <TouchableOpacity onPress={() => setShowWishListInput(true)} style={styles.addButton}>
              <Icon name="plus" size={20} color="#FFFDF3" />
              <Text style={styles.addButtonText}> Wunschziel hinzufügen</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.infoSection, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Button mode="contained">
              Zu den Einstellungen
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Development')}>
            <Button mode="contained">
              Zum Dev Screen
            </Button>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}