import { StyleSheet } from 'react-native';

const newStyle = StyleSheet.create({
    // General Containers
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f8f8f8',
        marginTop: 35,
    },
    containersmallMarginTop: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f8f8f8',
        marginTop: 15,
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
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container45Percent: {
        width: '45%',
    },
    rowMarginBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Text Styles
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    titleTextBlue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#3EAAE9",
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
    bodyTextBig: {
        fontSize: 18,
        color: '#333',
        marginBottom: 2
    },
    smallBodyText: {
        fontSize: 12,
        color: '#888',
    },
    boldMiniText: {
        fontSize: 10,
        color: '#f8f8f8',
        marginTop: 2,
        marginRight: 8,
        textAlign: 'right',
    },
    boldText: {
        fontWeight: 'bold',
    },
    boldTextBig: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    centerAlignedText: {
        textAlign: 'center',
    },
    blueText: {
        fontSize: 13,
        color: "#3EAAE9",
    },
    selectedUserItem: {
        backgroundColor: '#007BFF',
        borderRadius: 10,
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
    disabledButtonWrapper: {
        elevation: 0,
        shadowOpacity: 0,
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    buttonView: {
        width: "80%",
    },
    primaryButton: {
        backgroundColor: '#3498DB',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 8,
    },
    primaryRedButton: {
        backgroundColor: '#FF5430',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 8,
    },
    primaryButtonText: {
        color: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#b0c4de',
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
    smallRedButton: {
        backgroundColor: '#FF5430',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        marginRight: 20,
    },
    averageBlueButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        marginRight: 20,
        width: '48%',
    },
    averageRedButton: {
        backgroundColor: '#FF5430',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        marginRight: 20,
        width: '48%',
    },
    smallButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    newChatButton: {
        backgroundColor: '#3498DB',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    newChatButtonText: {
        color: '#f8f8f8',
        fontSize: 30,
        fontWeight: 'bold',
        lineHeight: 60,
        paddingBottom: 5,
    },
    roundButtonContainerTopRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    roundButtonContainerBottomRight: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    roundButtonWrapper: {
        // position: 'absolute',
        // right: 0,
        // top: 0,
        // padding: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 54,
        // justifyContent: 'center',
    },
    roundButton: {
        bottom: -10,
        right: -10,
        backgroundColor: '#3498DB',
        width: 60,
        height: 60,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    roundButtonAbsolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#3498DB',
        width: 50,
        height: 50,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        // Change Border radius to that when trying to make it fit on the right side of the screen
        // borderTopLeftRadius: 25,
        // borderBottomLeftRadius: 25,
    },
    notificationCircle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationText: {
        color: 'white',
        fontSize: 12,
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
        height: 48
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
        alignItems: 'left',
    },
    closeButtonX: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 10,
    },
    closeModalButton: {
        backgroundColor: '#f00',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    friendRequestModal: {
        position: 'absolute',
        right: -20,
        top: -20,
        width: '85%',
        height: '100%',
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
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
    mediumProfileImage: {
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
    extraSmallProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 30,
        borderColor: '#3EAAE9',
        borderWidth: 2,
        marginBottom: 16,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 16,
        height: 140,
    },
    profileImageWrapper: {
        alignItems: 'center',
        position: 'relative',
        marginBottom: 16,
        backgroundColor: '#f8f8f8',
        width: 140,
        height: 140,
    },

    // List Styles
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f8f8f8',
    },
    listItemText: {
        fontSize: 16,
        marginLeft: 10,
    },

    // Spacing Utilities
    marginBottomSmall: {
        marginBottom: 8,
    },
    marginBottomMedium: {
        marginBottom: 16,
    },
    marginBottomLarge: {
        marginBottom: 24,
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
    marginTopSmall: {
        marginTop: 8,
    },
    marginTopMedium: {
        marginTop: 16,
    },
    marginTopLarge: {
        marginTop: 24,
    },
    marginTopHuge: {
        marginTop: 54,
    },
    marginLeftSmall: {
        marginLeft: 8,
    },

    // Specific Styles for User Stats
    userStatsContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    userStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    userStatColumn: {
        alignItems: 'center',
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
        marginTop: 10,
    },
    userStatLabel: {
        fontWeight: '600',
        color: '#333',
    },
    userStatValue: {
        fontSize: 16,
        color: '#666',
    },

    // Post Styles
    postContainer: {
        backgroundColor: '#f8f8f8',
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

    // Reaction Styles
    voteRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 8,
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
        fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24,
    },
    iconSmall: {
        width: 40,   
        height: 40,  
        borderRadius: 12,  
      },      
    iconBig: {
        width: 48,
        height: 48,
    },
    iconBigCenter: {
        width: 48,
        height: 48,
        alignItems: 'center',
    },

    // Comment Section Styles
    commentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
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
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10,
    },

    // Profile Modal Styles
    profileModalContainer: {
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
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
        color: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Info Section Styles (for profile)
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
    // View
    inputView: {
        width: "80%",
        marginBottom: 20,
        backgroundColor: '#f8f8f8'
    },
    rememberView: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    inputLogin: {
        marginBottom: 15,
        backgroundLight: '#f8f8f8',
        color: '#070A0F',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    switch: {
        flexDirection: "row",
        alignItems: "center",
    },
    authSwitchTouchable: {
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
    },

    // Date Picker Style
    datePicker: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f8f8f8',
    },
});

export default newStyle;