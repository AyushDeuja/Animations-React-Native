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
import MapView, {
  Marker,
  Polyline,
  MapPressEvent,
  Region,
  LatLng,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

const Maps = () => {
  const [location, setLocation] = useState<Region | null>(null);
  const [source, setSource] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [isChoosingSource, setIsChoosingSource] = useState(false);
  const [isChoosingDestination, setIsChoosingDestination] = useState(false);

  const getUserCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      error => {
        console.warn('Location error:', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserCurrentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to access your location.',
          );
        }
      } catch (error) {
        console.warn('Permission error:', error);
      }
    } else {
      getUserCurrentLocation(); // iOS auto permission handling
    }
  };

  const showCoordinates = () => {
    if (source && destination) {
      const distance = getDistance(source, destination) / 1000; // in km
      Alert.alert(
        'Coordinates and Distance',
        `Source:\nLat: ${source.latitude}, Lon: ${
          source.longitude
        }\n\nDestination:\nLat: ${destination.latitude}, Lon: ${
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

  const handleMapPress = (e: MapPressEvent) => {
    const coordinates = e.nativeEvent.coordinate;
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
        region={location || undefined}
        showsUserLocation
        onPress={handleMapPress}
      >
        {location && (
          <Marker coordinate={location} title={'Current Location'} />
        )}
        {source && (
          <Marker
            coordinate={source}
            title="Source"
            pinColor="green"
            draggable
            onDragEnd={e => setSource(e.nativeEvent.coordinate)}
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="blue"
            draggable
            onDragEnd={e => setDestination(e.nativeEvent.coordinate)}
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
