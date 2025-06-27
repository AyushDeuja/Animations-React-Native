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
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

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

  const showCoordinates = () => {
    if (source && destination) {
      const distance =
        getDistance(
          // @ts-ignore
          { latitude: source?.latitude, longitude: source?.longitude },
          {
            // @ts-ignore
            latitude: destination?.latitude,
            // @ts-ignore
            longitude: destination?.longitude,
          },
        ) / 1000; // distance in kilometers
      Alert.alert(
        'Coordinates and Distance',
        `Source: \nLatitude: ${source.latitude}, Longitude: ${
          source.longitude
        }\n\n 
Destination: \nLatitude: ${destination.latitude}, Longitude: ${
          destination.longitude
        }\n\nDistance: ${distance.toFixed(2)} km`,
      );
    } else {
      Alert.alert(
        'Error',
        'Please select both source and destination to calculate distance.',
      );
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
          <Marker
            coordinate={source}
            title="Source"
            pinColor={'green'}
            draggable={true}
            onDragEnd={e => {
              // @ts-ignore
              setSource(e.nativeEvent.coordinate);
            }}
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor={'blue'}
            draggable={true}
            onDragEnd={e => {
              // @ts-ignore
              setDestination(e.nativeEvent.coordinate);
            }}
          />
        )}
        {source && destination && (
          <Polyline
            coordinates={[source, destination]}
            strokeColor="red"
            strokeWidth={2}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonGroup}>
          {source ? (
            <Button title="Remove Source" onPress={() => setSource(null)} />
          ) : (
            <Button
              title={
                isChoosingSource ? 'Please Choose Source' : 'Choose Source'
              }
              onPress={() => setIsChoosingSource(true)}
            />
          )}

          {destination ? (
            <Button
              title="Remove Destination"
              onPress={() => setDestination(null)}
            />
          ) : (
            <Button
              title={
                isChoosingDestination
                  ? 'Please Choose Destination'
                  : 'Choose Destination'
              }
              onPress={() => setIsChoosingDestination(true)}
            />
          )}
        </View>
        <Button title="Show Coordinates" onPress={showCoordinates} />
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
