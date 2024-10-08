import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
 container: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
 },
 map: {
   flex: 1,
   width: '100%',
 },
 bottomBar: {
   position: 'absolute',
   bottom: 0,
   left: 0,
   right: 0,
   backgroundColor: 'white',
   paddingVertical: 25,
 },
 bottomBarContent: {
   paddingHorizontal: 20,
 },
 placeItem: {
   marginRight: 10,
   padding: 5,
   borderRadius: 5,
   bottom: 0,
   backgroundColor: '#eee',
 },
 selectedPlaceItem: {
   marginRight: 10,
   padding: 5,
   borderRadius: 5,
   backgroundColor: '#dbe155', // Hintergrundfarbe für den ausgewählten Ort
 },
 crossButton: {
   position: 'absolute',
   bottom: 22,
   right: 16,
 },
 modalContainer: {
   position: 'absolute',
   bottom: 50,
   left: 0,
   right: 0,
 },
 modalContent: {
   backgroundColor: 'white',
   padding: 20,
   borderTopLeftRadius: 20,
   borderTopRightRadius: 20,
 },
 customPlaceItem: {
   padding: 10,
   borderBottomWidth: 1,
   borderBottomColor: '#ccc',
 },
 customSelectedPlaceItem: {
   backgroundColor: '#e0e0e0',
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
   marginLeft: 'auto', // Setzt das Sternsymbol ganz rechts
 },
 addButton: {
   position: 'absolute',
   top: 20,
   left: 20,
   backgroundColor: 'white',
   padding: 10,
   borderRadius: 20,
   zIndex: 1, // Stelle sicher, dass das Plus-Symbol über anderen Elementen liegt
   marginTop: 90,
   borderWidth: 1,
   borderColor: 'black',
 },
 searchContainer: {
   position: 'relative', // Ändere die Position auf 'relative', um 'absolute'-positionierte Kinder zu berücksichtigen
   flexDirection: 'row',
   justifyContent: 'center',
   marginBottom: 10,
   marginTop: 30,
   zIndex: 2,
 },
 searchInput: {
   width: '70%',
   height: 40,
   borderWidth: 1,
   borderColor: 'gray',
   marginLeft: 10,
   marginRight: 10,
   marginTop: 10,
   paddingHorizontal: 10,
 },
 listViewContainer: {
   position: 'absolute',
   top: '100%',
   maxHeight: 150,
   zIndex: 10,
 },
 searchLocationButton: {
   height: 40,
   color: 'black',
 },
 button: {
   backgroundColor: "#3EAAE9",
   height: 40,
   borderRadius: 7,
   marginTop: 10,
   marginRight: 5,
 },
 buttonText: {
   fontSize: 18,
   fontWeight: "bold",
 },
 disabledContainer: {
   opacity: 0.5, // Verringert die Deckkraft des Containers, um ihn auszugrauen
 },
 disabledInput: {
   backgroundColor: '#f2f2f2', // Ändert die Hintergrundfarbe des Eingabefelds, um es auszugrauen
 },
});