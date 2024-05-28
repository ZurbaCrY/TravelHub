import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native'; // Importiere useNavigation
import AuthService from '../User-Auth/auth'
import Button from '../components/Button';
import { styles } from '../style/styles';

export default function ProfileScreen () {
  user = AuthService.getUser();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [visitedCountries, setVisitedCountries] = useState(['Italien', 'Spanien', 'Frankreich']);
  const [wishListCountries, setWishListCountries] = useState(['Japan', 'Neuseeland', 'Brasilien']);
  const [newVisited, setNewVisited] = useState('');
  const [newWishList, setNewWishList] = useState('');
  const [showVisitedInput, setShowVisitedInput] = useState(false);
  const [showWishListInput, setShowWishListInput] = useState(false);

  const navigation = useNavigation(); // Navigation Hook

  const addVisitedCountry = () => {
    if (newVisited) {
      setVisitedCountries([...visitedCountries, newVisited]);
      setNewVisited('');
    }
    setShowVisitedInput(false);
  };

  const addWishListCountry = () => {
    if (newWishList) {
      setWishListCountries([...wishListCountries, newWishList]);
      setNewWishList('');
    }
    setShowWishListInput(false);
  };

  const removeVisitedCountry = (index) => {
    const updatedCountries = [...visitedCountries];
    updatedCountries.splice(index, 1);
    setVisitedCountries(updatedCountries);
  };

  const removeWishListCountry = (index) => {
    const updatedCountries = [...wishListCountries];
    updatedCountries.splice(index, 1);
    setWishListCountries(updatedCountries);
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowVisitedInput(false);
      setShowWishListInput(false);
    }}>
      <View style={[styles.containerProfileScreen, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
        <View style={[styles.profileSection, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',}]}>
          <Image
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/PICA.jpg/1200px-PICA.jpg'}}
            style={styles.profileImage}
          />
          <Text style={[styles.name, {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>{ user.user_metadata.username }</Text>
          <Text style={[styles.details, {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>{ user.email }</Text>
          <View style={styles.row}>
            <Icon name="birthday-cake" size={14} style={[styles.iconRightMargin, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]} />
            <Text style={[styles.details, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>
              { user.user_metadata.birthday ?  user.user_metadata.birthday  : 'No birthdate configured'}
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
              <Button onPress={addWishListCountry} color="#58CFEC">Hinzufügen</Button>
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
          {wishListCountries.map((country, index) => (
            <View key={index} style={styles.countryItem}>
              <Text style={styles.details}>{country}</Text>
              <TouchableOpacity onPress={() => removeWishListCountry(index)} style={styles.removeButton}>
                <Icon name="trash" size={20} color="#FFFDF3" />
              </TouchableOpacity>
            </View>
          ))}
          {showWishListInput && (
            <>
              <TextInput
                style={styles.input}
                onChangeText={setNewWishList}
                value={newWishList}
                placeholder=""
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
        <View style={[styles.container]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')} >
          <Button mode="contained"> Zu den Einstellungen</Button>
        </TouchableOpacity>
        </View>
        </View>
    </TouchableWithoutFeedback>
  );
};

