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
  profileImageScreen: {
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
  inputLogin: {
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
  // New styles for ProfileScreen
  countryTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: 5,
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
  chatInputDarkMode: {
    color: '#FFF',
  },
  modalOverlayChatScreen: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentChatScreen: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitleChatScreen: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtonTextChatScreen: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonChatScreen: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editedText: {
    fontSize: 10,
    color: '#ffffff',
    marginTop: 2,
    marginRight: 8,
    textAlign: 'right',
  },

  // CommunityScreen styles
  communityContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',  
    marginVertical: 10,       
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    padding: 15,
  },
  newPostButton: {
    backgroundColor: '#3498DB',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  newPostButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
  postText: {
    marginVertical: 5,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  icon: {
    width: 25,
    height: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  uploadIcon: {
    width: 40,
    height: 40,
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3498DB',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  //communityDetailScreen
  CommunityDetailContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  icon: {
    width: 25,
    height: 25,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
  },
  voteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voterProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  voterUsername: {
    fontSize: 16,
  },
  voteCount: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  updropdown: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '50%',
    alignSelf: 'flex-start',
  },
  downdropdown: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '50%',
    alignSelf: 'flex-end',
  },
  commentSection: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10,
},
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentText: {
    fontSize: 16,
  },
  voterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  // PlaceDetailModal styles
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
  
  // General button wrapper
  buttonWrapper: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 10,
    elevation: 2,  // Adds subtle shadow on Android
    shadowColor: '#000',  // iOS shadow properties
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  // Disabled state wrapper for disabled buttons
  disabledWrapper: {
    elevation: 0,
    shadowOpacity: 0,
  },

  // General button style
  newPostButton: {
    backgroundColor: '#3498DB',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // Disabled button style
  disabledButton: {
    backgroundColor: '#b0c4de',
  },

  // Button text style
  newPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },

});
