import { StyleSheet } from 'react-native';

const newStyle = StyleSheet.create({
    // General Containers
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f8f8f8',
        marginTop: 35,
    },
    containerNoMarginTop: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f8f8f8',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // Text Styles
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    bodyText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 2
    },
    smallBodyText: {
        fontSize: 12,
        color: '#888',
    },
    boldMiniText: {
        fontSize: 10,
        color: '#ffffff',
        marginTop: 2,
        marginRight: 8,
        textAlign: 'right',
    },
    boldTextLeft: {
        fontWeight: 'bold',

    },
    centerAlignedText: {
        textAlign: 'center',
    },
    selectedUserItem: {
        backgroundColor: '#007BFF',
      },
    // Button Styles
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
    primaryButton: {
        backgroundColor: '#3498DB',
        borderRadius: 10,
        paddingVertical: 15,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    smallButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        marginRight: 20,
    },
    smallButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Input Styles
    inputField: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: 'white',
    },

    // Modal Styles
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    modalTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContentWidth: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    // Image Styles
    largeProfileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderColor: '#3EAAE9',
        borderWidth: 3,
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: '#3EAAE9',
        borderWidth: 3,
        marginBottom: 16,
    },
    smallProfileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: '#3EAAE9',
        borderWidth: 3,
        marginBottom: 16,
    },

    // Post Styles
    postContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
      },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    postText: {
        fontSize: 16,
        color: '#333',
    },
    paddingHorizontalSmall: {
        paddingHorizontal: 8,
    },
    paddingHorizontalMedium: {
        paddingHorizontal: 16,
    },
    marginRightExtraSmall: {
        marginRight: 4,
    },

    // Specific Styles for User Stats
    userStatsContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    // Reaction Styles
    voteRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    voteCount: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
    },
    icon: {
        width:  24,
        height: 24,
    },
    iconBig: {
        width: 48,
        height: 48,
    },
    // Comment Section Styles
    commentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    userStatColumn: {
        alignItems: 'center',
        flex: 1,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 10,
        height: 40,
        marginRight: 10,
    },
    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    commentText: {
        fontSize: 14,
        marginLeft: 10,
        color: '#333',
    },
    commentUsername: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    // Profile Modal Styles
    profileModalContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        margin: 20,
    },
    profileModalText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    profileModalButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
    },
    profileModalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#666',
    },
    //Profil
    infoSection: {
        backgroundColor: '#3EAAE9',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
      },
      details: {
        fontSize: 16,
        marginVertical: 2,
      },
});

export default newStyle;