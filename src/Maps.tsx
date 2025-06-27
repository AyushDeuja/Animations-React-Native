import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const Maps = () => {
  return (
    <View style={styles.container}>
      <Text>Maps</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={data => console.log(data)}
      >
        <Marker
          coordinate={{
            latitude: 37.7885,
            longitude: -122.4324,
            //@ts-ignore
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          title={'Testing'}
          onPress={data => console.log(data.nativeEvent.coordinate)}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Maps;
