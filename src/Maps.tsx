import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Maps = () => {
  const [location, setLocation] = useState(null);

  const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getUserCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      console.log(position);
      setLocation({
        //@ts-ignore
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getUserCurrentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to access your location.',
          );
        }
      } catch (error) {
        console.warn('Location permission error: ', error);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Maps</Text>
      <MapView
        style={styles.map}
        // @ts-ignore
        region={location}
        onRegionChangeComplete={data => console.log(data)}
        showsUserLocation={true}
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
