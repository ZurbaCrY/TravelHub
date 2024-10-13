import { StyleSheet } from "react-native";

export const slideUpListStyles = StyleSheet.create({
  sheetContent: {
    backgroundColor: 'white', // Hintergrund der Liste
    padding: 20,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedPlaceItem: {
    backgroundColor: '#dbe155', // Farbe für den ausgewählten Ort
  },
  customPlaceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customPlaceItemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  customPlaceItemTextContainer: {
    flex: 1,
  },
  customPlaceItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customPlaceItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  starIconContainer: {
    marginLeft: 'auto', // Sternsymbol rechts
  },
  arrowDown: {
    alignSelf: 'center', // Zentriert den Pfeil nach unten
    marginBottom: 10,
  },
  emptyListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  hiddenList: {
    height: 50, // Höhe für den Strich, der sichtbar sein soll
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
