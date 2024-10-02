import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import Flag from 'react-native-flags';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../services/auth'
import Button from '../components/Button';
import { styles } from '../styles/styles';
import { supabase } from '../services/supabase';
import { getProfilePictureUrlByUserId } from '../backend/community';

export default function ProfileScreen() {
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { isDarkMode } = useDarkMode();
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [wishListCountries, setWishListCountries] = useState([]);
  const [newVisited, setNewVisited] = useState('');
  const [newWishList, setNewWishList] = useState('');
  const [showVisitedInput, setShowVisitedInput] = useState(false);
  const [showWishListInput, setShowWishListInput] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    const fetchProfilePictureUrl = async () => {
      const url = await getProfilePictureUrlByUserId();
      setProfilePictureUrl(url); // Directly assigning the fetched URL to state
    };

    fetchProfilePictureUrl();
  }, []);

  const navigation = useNavigation();

  // Lädt die besuchten Länder und Wunschländer, wenn die Komponente geladen wird
  useEffect(() => {
    const fetchVisitedCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('Visited Countries')
          .select(`
            Country_ID,
            verified,
            Country (Countryname)
          `)
          .eq('user_id', CURRENT_USER_ID);

        if (error) {
          throw error;
        }
        // Formatiert die Daten in ein passendes Format für die Anzeige
        const countries = data.map(item => ({
          name: item.Country.Countryname,
          verified: item.verified
        }));
        setVisitedCountries(countries);
      } catch (error) {
        console.error('Error fetching visited countries:', error);
      }
    };

    const fetchWishListCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('DesiredDestinationProfile')
          .select('country')
          .eq('user_id', CURRENT_USER_ID)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setWishListCountries(data ? data.country : []);
      } catch (error) {
        console.error('Error fetching wishlist countries:', error);
      }
    };

    fetchVisitedCountries();
    fetchWishListCountries();
  }, [CURRENT_USER_ID]);

  // Überprüft, ob das Land in der Tabelle "Country" existiert
  const validateCountry = async (countryName) => {
    try {
      const { data, error } = await supabase
        .from('Country')
        .select('Country_ID')
        .ilike('Countryname', countryName);

      if (error || !data || data.length === 0) {
        throw error || new Error('Country not found');
      }

      return data[0].Country_ID;
    } catch (error) {
      console.error('Error validating country:', error);
      return null;
    }
  };

  // Fügt ein neues Land zu den besuchten Ländern hinzu
  const addVisitedCountry = async () => {
    if (newVisited) {
      // Überprüft, ob das Land bereits in der Liste der besuchten Länder enthalten ist
      if (visitedCountries.some(country => country.name.toLowerCase() === newVisited.toLowerCase())) {
        alert('Das Land ist bereits in der Liste der besuchten Länder.');
        return;
      }

      const countryId = await validateCountry(newVisited);

      if (!countryId) {
        alert('Das eingegebene Land ist nicht in der Tabelle "Country" vorhanden.');
        return;
      }

      const updatedVisited = [...visitedCountries, { name: newVisited, verified: false }];
      setVisitedCountries(updatedVisited);
      setNewVisited('');

      try {
        const { error } = await supabase
          .from('Visited Countries')
          .insert({
            user_id: CURRENT_USER_ID,
            Country_ID: countryId,
            verified: false
          });

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error adding visited country:', error);
      }
    }
    setShowVisitedInput(false);
  };
  // Fügt ein neues Land zur Wunschliste hinzu
  const addWishListCountry = async () => {
    if (newWishList) {
      // Überprüft, ob das Land bereits in der Wunschliste enthalten ist
      if (wishListCountries.some(country => country.toLowerCase() === newWishList.toLowerCase())) {
        alert('Das Land ist bereits in der Wunschliste.');
        return;
      }

      const countryId = await validateCountry(newWishList);

      if (!countryId) {
        alert('Das eingegebene Land ist nicht in der Tabelle "Country" vorhanden.');
        return;
      }

      const updatedWishList = [...wishListCountries, newWishList];
      setWishListCountries(updatedWishList);
      setNewWishList('');

      try {
        const { error } = await supabase
          .from('DesiredDestinationProfile')
          .upsert({ user_id: CURRENT_USER_ID, country: updatedWishList }, { onConflict: ['user_id'] });

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error updating wishlist countries:', error);
      }
    }
    setShowWishListInput(false);
  };

  // Entfernt ein Land aus den besuchten Ländern
  const removeVisitedCountry = async (index) => {
    const countryToRemove = visitedCountries[index];
    const updatedCountries = [...visitedCountries];
    updatedCountries.splice(index, 1);
    setVisitedCountries(updatedCountries);

    try {
      const { data, error } = await supabase
        .from('Country')
        .select('Country_ID')
        .ilike('Countryname', countryToRemove.name);

      if (error || !data || data.length === 0) {
        throw error || new Error('Country not found');
      }

      const { error: deleteError } = await supabase
        .from('Visited Countries')
        .delete()
        .eq('user_id', CURRENT_USER_ID)
        .eq('Country_ID', data[0].Country_ID);

      if (deleteError) {
        throw deleteError;
      }
    } catch (error) {
      console.error('Error deleting visited country:', error);
    }
  };

  // Entfernt ein Land aus der Wunschliste
  const removeWishListCountry = async (index) => {
    const updatedCountries = [...wishListCountries];
    updatedCountries.splice(index, 1);
    setWishListCountries(updatedCountries);

    try {
      if (updatedCountries.length === 0) {
        const { error } = await supabase
          .from('DesiredDestinationProfile')
          .delete()
          .eq('user_id', CURRENT_USER_ID);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('DesiredDestinationProfile')
          .upsert({ user_id: CURRENT_USER_ID, country: updatedCountries }, { onConflict: ['user_id'] });

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error updating wishlist countries:', error);
    }
  };

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
            style={styles.profileImageScreen}
          />
          <Text style={[styles.name, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>{CURRENT_USER.user_metadata.username}</Text>
          <Text style={[styles.details, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>{CURRENT_USER.email}</Text>
          <View style={styles.row}>
            <Icon name="birthday-cake" size={14} style={[styles.iconRightMargin, { color: isDarkMode ? '#FFFDF3' : '#000000' }]} />
            <Text style={[styles.details, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
              {CURRENT_USER.user_metadata.birthday ? CURRENT_USER.user_metadata.birthday : 'No birthdate configured'}
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
