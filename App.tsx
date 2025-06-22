import { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

function App() {
  const opacity = useState(new Animated.Value(0))[0];
  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
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
          opacity,
          borderRadius: 100 / 2,
          backgroundColor: 'red',
        }}
      />
      <TouchableOpacity onPress={fadeIn}>
        <Text>Press to fadeIn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={fadeOut}>
        <Text>Press to fadeOut</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
