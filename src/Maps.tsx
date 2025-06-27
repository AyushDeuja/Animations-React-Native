import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const Maps = () => {
  const [location, setLocation] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isChoosingSource, setIsChoosingSource] = useState(false);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);

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

  const handleMapPress = (e: any) => {
    const coordinates = e.nativeEvent.coordinate;
    console.log(coordinates);
    if (isChoosingSource) {
      setSource(coordinates);
      setIsChoosingSource(false);
    } else if (isChoosingDestination) {
      setDestination(coordinates);
      setIsChoosingDestination(false);
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
        showsUserLocation={true}
        onPress={handleMapPress}
      >
        {location && (
          <Marker
            coordinate={location}
            title={'Testing'}
            onPress={data => console.log(data.nativeEvent.coordinate)}
          />
        )}

        {source && (
          <Marker coordinate={source} title="Source" pinColor={'green'} />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor={'blue'}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonGroup}>
          <Button
            title={isChoosingSource ? 'Please Choose Source' : 'Choose Source'}
            onPress={() => setIsChoosingSource(true)}
          />
          <Button
            title={
              isChoosingDestination
                ? 'Please Choose Destination'
                : 'Choose Destination'
            }
            onPress={() => setIsChoosingDestination(true)}
          />
        </View>
        <Button title="Show Coordinates" />
      </View>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default Maps;
