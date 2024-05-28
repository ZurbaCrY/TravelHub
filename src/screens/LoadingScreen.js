import { View, Text} from 'react-native';
import { styles } from '../style/styles';

export default function LoadingScreen  ({ visible }) {
  return(
    <View style={styles.container}>
    <Text style={styles.title}>
      loading
    </Text>
  </View>
  )
}
