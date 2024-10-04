import { StyleSheet } from 'react-native';

const newStyle = StyleSheet.create({
    // General Containers
    container: {
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
        justifyContent: 'space-between',
    },

    // Text Styles
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    subtitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
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
    boldText: {
        fontWeight: 'bold',
    },
    centerAlignedText: {
        textAlign: 'center',
    },

    // Button Styles
    primaryButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#a9a9a9',
    },

    smallButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
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

    // List Styles
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
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

    // Specific Styles for User Stats
    userStatsContainer: {
        marginVertical: 20,
        alignItems: 'center', // Center the rows
    },
    userStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Space between columns
        width: '100%', // Full width of the parent
        marginBottom: 10, // Space between rows
    },
    userStatColumn: {
        alignItems: 'center', // Center the text in each column
        flex: 1, // Make columns share the space equally
    },
    userStatLabel: {
        fontWeight: '600',
        color: '#333',
    },
    userStatValue: {
        fontSize: 16,
        color: '#666',
    },

});

export default newStyle;