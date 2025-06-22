import { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

function App() {
  const leftValue = useState(new Animated.Value(0))[0];
  const moveBall = () => {
    Animated.timing(leftValue, {
      toValue: 1000,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          width: 100,
          height: 100,
          marginLeft: leftValue,
          borderRadius: 100 / 2,
          backgroundColor: 'red',
        }}
      />
      <TouchableOpacity onPress={moveBall}>
        <Text>Press to move</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
