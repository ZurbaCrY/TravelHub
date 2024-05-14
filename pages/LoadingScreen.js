import { View, Modal, ActivityIndicator} from 'react-native';

export default function LoadingScreen  ({ visible }) {
  <Modal transparent={true} visible={visible}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  </Modal>
}
