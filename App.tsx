import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function App() {
  const pan = useState(new Animated.ValueXY())[0];

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (_, gesture) => {
        pan.x.setValue(gesture.dx);
        pan.y.setValue(gesture.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  )[0];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <Animated.View
        style={[
          {
            width: 100,
            height: 100,
            transform: [
              {
                translateX: pan.x,
              },
              {
                translateY: pan.y,
              },
            ],
            borderRadius: 100 / 2,
            backgroundColor: 'red',
          },
          // pan.getLayout(),
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

export default App;
