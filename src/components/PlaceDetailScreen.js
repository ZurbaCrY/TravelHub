import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Alert from './Alert';
import { loadRatings, saveRatingToDB } from '../backend/LoadEditPlaceData';

const PlaceDetailScreen = ({ visible, place, onClose }) => {
  const translateX = useRef(new Animated.Value(-1000)).current;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [message, setMessage] = useState('');

useEffect(() => {
  if (visible && place) {
    // Animation starten
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Bewertungen aus der DB laden
    const fetchRatings = async () => {
      const ratings = await loadRatings(place.placeId); // place.placeId ist die Attraction_Id
      setReviews(ratings);  // Setze die Bewertungen im Zustand
    };

    fetchRatings();
  }
}, [visible, place]);

  if (!visible || !place) {
    return null;
  }

  const showAlert = (message) => {
      setMessage(message);
      setAlertVisible(true);
  };

  const handleRatingPress = (value) => {
    setRating(value);
  };

 const handleSubmitReview = async () => {
   if (rating > 0 && review.trim() !== '') {
     // Neue Bewertung lokal erstellen
     const newReview = {
       id: Math.random().toString(36).substr(2, 9),  // Temporäre ID für die lokale Anzeige
       rating,
       text: review,
       date: new Date().toLocaleDateString(),
     };

     // Bewertung in die DB speichern
     const result = await saveRatingToDB(place.placeId, rating, review);

     if (result.success) {
       // Wenn die Bewertung erfolgreich gespeichert wurde, zur lokalen Anzeige hinzufügen
       setReviews([...reviews, newReview]);
       setReview('');  // Eingabefeld leeren
       setRating(0);   // Bewertung zurücksetzen
     } else {
       showAlert('Fehler beim Speichern der Bewertung: ');
     }
   } else {
     showAlert('Bitte geben Sie eine Bewertung und einen Text ein.');
   }
 };


  const renderReviewItem = (item) => {
    if (!item || item.rating === undefined) return null; // Sicherheitsüberprüfung

    return (
      <View style={styles.reviewItem} key={item.rating_id}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= item.rating ? 'star' : 'star-o'}
                size={18}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.reviewDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.reviewText}>{item.text}</Text>
      </View>
    );
  };



  return (
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Schließen-Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>

        {/* Name des Ortes */}
        <Text style={styles.placeName}>{place.name}</Text>

        {/* Bild des Ortes */}
        {place.link ? (
          <Image
            source={{ uri: place.link }}
            style={styles.placeImage}
            onError={() => console.error("Image failed to load")}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}

        {/* Relevante Infos als Liste */}
        <View style={styles.infoList}>
          {place.type === 'Sehenswürdigkeit' && (
            <Text style={styles.infoItem}>Eintrittsgebühr: {place.entranceFee} Euro</Text>
          )}
          {place.type === 'Restaurant' && (
            <Text style={styles.infoItem}>Preisniveau: {place.priceLevel}</Text>
          )}
          {place.type === 'Einkaufsladen' && (
            <Text style={styles.infoItem}>Geöffnet: {place.isOpen ? 'Ja' : 'Nein'}</Text>
          )}
        </View>

        {/* Beschreibung */}
        <Text style={styles.placeDescription}>{place.description}</Text>

        {/* Sternebewertung */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Bewertung:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
                <FontAwesome
                  name={star <= rating ? 'star' : 'star-o'}
                  size={32}
                  color="#FFD700"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bereich zum Bewertungen schreiben */}
        <View style={styles.reviewContainer}>
          <TextInput
            style={styles.reviewInput}
            placeholder="Ihre Bewertung hier eingeben..."
            value={review}
            onChangeText={setReview}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
            <Text style={styles.submitButtonText}>Senden</Text>
          </TouchableOpacity>
        </View>

        {/* Vorhandene Bewertungen */}
        <View style={styles.reviewsContainer}>
          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>Keine Bewertungen vorhanden.</Text>
          ) : (
        <FlatList
          data={reviews}
          renderItem={({ item }) => renderReviewItem(item)}
          keyExtractor={(item) => item.rating_id ? item.rating_id.toString() : Math.random().toString()}
        />
          )}
        </View>
      </ScrollView>

        <Alert
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          message={message}
        />
    </Animated.View>
  );
};

PlaceDetailScreen.propTypes = {
  visible: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    link: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string,
    entranceFee: PropTypes.number,
    priceLevel: PropTypes.string,
    isOpen: PropTypes.bool,
    viewpointType: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 9999,
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  placeName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  placeImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    marginBottom: 15,
  },
  infoList: {
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  placeDescription: {
    fontSize: 16,
    marginVertical: 10,
    lineHeight: 22,
  },
  ratingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 5,
  },
  reviewContainer: {
    marginVertical: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3EAAE9',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    color: '#777',
  },
  reviewText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
});

export default PlaceDetailScreen;
