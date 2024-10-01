
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // General Styles
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 20,
    color: "#3EAAE9",
  },
  authSwitchTouchable: {
    alignItems: "center",
    marginBottom: 20,
  },
  inputView: {
    width: "80%",
    marginBottom: 20,
  },
  rememberView: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
  },
  forgetText: {
    fontSize: 13,
    color: "#3EAAE9",
  },
  buttonView: {
    width: "80%",
  },
  button: {
    backgroundColor: "#3EAAE9",
    height: 45,
    borderRadius: 7,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 10,
  },
  switchText: {
    fontSize: 16,
    color: "#3EAAE9",
  },

  // Profile styles
  containerProfileScreen: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginLeft: 10,
  },
  infoSection: {
    backgroundColor: '#3EAAE9',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
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

  // AnimatedSwitch styles
  buttonViewAnimatedSwitch: {
    width: '80%',
    margin: 5,
    marginTop: 0,
    marginBottom: 0,
  },
  containerAnimatedSwitch: {
    width: 50,
    height: 28,
    borderRadius: 36.5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  containerActiveAnimatedSwitch: {
    backgroundColor: '#3EAAE9',
  },
  backgroundAnimatedSwitch: {
    ...StyleSheet.absoluteFill,
    borderRadius: 36.5,
    backgroundColor: '#bdbdbd',
  },
  backgroundActiveAnimatedSwitch: {
    backgroundColor: '#3EAAE9',
  },
  circleAnimatedSwitch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },

  // AddPlaceModal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationInput: {
    color: 'gray',
    marginTop: 7,
    fontSize: 15,
  },
  addButtonModal: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonModal: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 10,
  },
  dropdown: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  locationButton: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  locationButtonSelected: {
    backgroundColor: "lightgreen",
  },
  mapContainer: {
    width: '100%',
    height: 300,
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  // ChatListScreen styles
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentChat: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitleChat: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedUserItem: {
    backgroundColor: '#007BFF',
  },
  userName: {
    fontSize: 16,
  },

  // ChatScreen styles
  chatContainer: {
    flex: 1,
  },
  chatInput: {
    color: '#000',
  },
  chatInputDarkMode: {
    color: '#FFF',
  },

  // CommunityScreen styles
  communityPostContainer: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    marginVertical: 5,
    width: 350,
  },
  communityPostContainerDark: {
    backgroundColor: '#374151',
  },
  postContent: {
    color: '#000',
  },
  postContentDark: {
    color: '#FFF',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
  },
  postAuthor: {
    color: '#6B7280',
    fontSize: 12,
  },
  postAuthorDark: {
    color: '#9CA3AF',
  },
  inputPost: {
    width: '70%',
    height: 40,
    borderWidth: 3,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderColor: '#8a8a8a',
  },
  postActions: {
    flexDirection: 'row',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  voteIcon: {
    width: 20,
    height: 20,
  },
  voteText: {
    fontSize: 12,
    marginLeft: 3,
    color: '#000',
  },
  voteTextDark: {
    color: '#FFF',
  },
  imageIcon: {
    width: 50,
    height: 50,
  },
  // Styles für PlaceDetailModal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  placeType: {
    fontSize: 16,
    marginBottom: 10,
  },
  entranceFee: {
    fontSize: 16,
    marginBottom: 10,
  },
  priceLevel: {
    fontSize: 16,
    marginBottom: 10,
  },
  isOpen: {
    fontSize: 16,
    marginBottom: 10,
  },
  viewpointType: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

   // Neue Styles für ProfileScreen
   countryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: 5,
  },
});
