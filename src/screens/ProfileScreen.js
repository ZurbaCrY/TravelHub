import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Flag from 'react-native-flags';
import { useDarkMode } from './DarkModeContext';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../User-Auth/auth';
import Button from '../components/Button';
import { styles } from '../style/styles';
import { supabase } from '../User-Auth/supabase';

export default function ProfileScreen () {
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [visitedCountries, setVisitedCountries] = useState(['Italien', 'Spanien', 'Frankreich']);
  const [wishListCountries, setWishListCountries] = useState([]);
  const [newVisited, setNewVisited] = useState('');
  const [newWishList, setNewWishList] = useState('');
  const [showVisitedInput, setShowVisitedInput] = useState(false);
  const [showWishListInput, setShowWishListInput] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchWishListCountries = async () => {
      const { data, error } = await supabase
        .from('DesiredDestinationProfile')
        .select('country')
        .eq('user_id', CURRENT_USER_ID)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 indicates no rows found
        console.error('Error fetching wishlist countries:', error);
      } else if (data) {
        setWishListCountries(data.country || []);
      }
    };

    fetchWishListCountries();
  }, [CURRENT_USER_ID]);

  const addWishListCountry = async () => {
    if (newWishList) {
      const updatedWishList = [...wishListCountries, newWishList];
      setWishListCountries(updatedWishList);
      setNewWishList('');

      const { error } = await supabase
        .from('DesiredDestinationProfile')
        .upsert({ user_id: CURRENT_USER_ID, country: updatedWishList }, { onConflict: ['user_id'] });

      if (error) {
        console.error('Error updating wishlist countries:', error);
      }
    }
    setShowWishListInput(false);
  };

  const removeWishListCountry = async (index) => {
    const updatedCountries = [...wishListCountries];
    updatedCountries.splice(index, 1);
    setWishListCountries(updatedCountries);

    if (updatedCountries.length === 0) {
      const { error } = await supabase
        .from('DesiredDestinationProfile')
        .delete()
        .eq('user_id', CURRENT_USER_ID);

      if (error) {
        console.error('Error deleting wishlist countries:', error);
      }
    } else {
      const { error } = await supabase
        .from('DesiredDestinationProfile')
        .upsert({ user_id: CURRENT_USER_ID, country: updatedCountries }, { onConflict: ['user_id'] });

      if (error) {
        console.error('Error updating wishlist countries:', error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowVisitedInput(false);
      setShowWishListInput(false);
    }}>
      <ScrollView style={[styles.containerProfileScreen, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
        <View style={[styles.profileSection, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',}]}>
          <Image
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/PICA.jpg/1200px-PICA.jpg'}}
            style={styles.profileImage}
          />
          <Text style={[styles.name, {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>{ CURRENT_USER.user_metadata.username }</Text>
          <Text style={[styles.details, {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>{ CURRENT_USER.email }</Text>
          <View style={styles.row}>
            <Icon name="birthday-cake" size={14} style={[styles.iconRightMargin, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]} />
            <Text style={[styles.details, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>
              { CURRENT_USER.user_metadata.birthday ?  CURRENT_USER.user_metadata.birthday  : 'No birthdate configured'}
            </Text>
          </View>
          <View style={styles.row}>
            <Flag code="DE" size={16} style={styles.iconRightMargin} />
            <Text style={[styles.details, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>Deutschland</Text>
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.header}>Bereits besuchte Länder:</Text>
          {visitedCountries.map((country, index) => (
            <View key={index} style={styles.countryItem}>
              <Text style={styles.details}>{country}</Text>
              <TouchableOpacity onPress={() => removeVisitedCountry(index)} style={styles.removeButton}>
                <Icon name="trash" size={20} color="#FFFDF3" />
              </TouchableOpacity>
            </View>
          ))}
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
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Button mode="contained"> Zu den Einstellungen</Button>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
