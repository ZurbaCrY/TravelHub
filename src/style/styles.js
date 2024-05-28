import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  input: {
    marginBottom: 15,
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
    marginTop: 10
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
  //Profile
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
  //ende des Profile styles
});