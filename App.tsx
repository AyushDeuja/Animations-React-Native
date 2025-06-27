import { View } from 'react-native';
import Maps from './src/Maps';
import PanResponderComponent from './src/PanResponderComponent';

function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Maps />
      {/* <PanResponderComponent /> */}
    </View>
  );
}

export default App;
