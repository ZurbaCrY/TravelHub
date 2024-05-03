import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Flag from 'react-native-flags';
import { useDarkMode } from './DarkModeContext';
import { useNavigation } from '@react-navigation/native'; // Importiere useNavigation

const ProfileScreen = () => {
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
      <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
        <View style={[styles.profileSection, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',}]}>
          <Image
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/PICA.jpg/1200px-PICA.jpg'}}
            style={styles.profileImage}
          />
          <Text style={[styles.name, {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>Max Mustermann</Text>
          <Text style={[styles.details, {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>max@example.com</Text>
          <View style={styles.row}>
            <Icon name="birthday-cake" size={14} style={[styles.iconRightMargin, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]} />
            <Text style={[styles.details, , {color: isDarkMode ? '#FFFDF3' : '#000000'  }]}>01.01.1980</Text>
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
              <Button title="Hinzufügen" onPress={addVisitedCountry} color="#58CFEC" />
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
                placeholder="Neues Wunschziel hinzufügen"
                placeholderTextColor="#cccccc"
              />
              <Button title="Hinzufügen" onPress={addWishListCountry} color="#58CFEC" />
            </>
          )}
          {!showWishListInput && (
            <TouchableOpacity onPress={() => setShowWishListInput(true)} style={styles.addButton}>
              <Icon name="plus" size={20} color="#FFFDF3" />
              <Text style={styles.addButtonText}> Wunschziel hinzufügen</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Hinzufügung des Navigation Buttons */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>Zu den Einstellungen</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#3EAAE9',
    borderWidth: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  details: {
    fontSize: 16,
    marginVertical: 2,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#58CFEC',
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: '#3D52D5',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFDF3',
    color: '#070A0F',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFDF3',
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 10,
  },
  removeButton: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  iconRightMargin: {
    marginRight: 5,
  },
  navButton: {
    backgroundColor: '#3D52D5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  navButtonText: {
    color: '#FFFDF3',
    fontSize: 18,
  },
});

export default ProfileScreen;
