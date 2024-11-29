import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { mapStyles } from "@/styles/mapStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RFValue } from "react-native-responsive-fontsize";
import { useUserStore } from "@/store/useStore";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { reverseGeocode } from "@/utils/mapUtils";
import haversine from "haversine-distance";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const mapRef = useRef<MapView>(null);
  const isFocused = useIsFocused();
  const [markers, setMarkers] = useState<any>([]);

  const MAX_DISTANCE_THRESHOLD = 10000;

  const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();

  const askLocationAccess = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        mapRef?.current?.fitToCoordinates([{ latitude, longitude }], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        handleRegionChangeComplete(newRegion);
      } catch (error) {
        console.log("Error getting current location", error);
      }
    } else {
      console.log("Permission to access location was denied");
    }
  };

  useEffect(() => {
    if (isFocused) {
      askLocationAccess();
    }
  }, [mapRef, isFocused]);

  const handleRegionChangeComplete = async (newRegion: Region) => {
    const address = await reverseGeocode(
      newRegion?.latitude,
      newRegion?.longitude
    );
    setLocation({
      longitude: newRegion?.longitude,
      latitude: newRegion?.latitude,
      address: address,
    });
    const userLocation = {
      latitude: location?.latitude,
      longitude: location?.longitude,
    } as any;

    if (userLocation) {
      const newLocation = {
        latitude: newRegion?.latitude,
        longitude: newRegion?.longitude,
      };
      const distance = haversine(userLocation, newLocation);
      setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
    }
  };

  const handleGpsButtonPress = async () => {};

  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        maxZoomLevel={16}
        minZoomLevel={12}
        pitchEnabled={false}
        style={{ flex: 1 }}
        onRegionChangeComplete={handleRegionChangeComplete}
        initialRegion={indiaIntialRegion}
        provider="google"
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsUserLocation={true}></MapView>

      <View style={mapStyles.centerMarkerContainer}>
        <Image
          source={require("@/assets/icons/marker.png")}
          style={mapStyles.marker}
        />
      </View>

      <TouchableOpacity
        style={mapStyles.gpsButton}
        onPress={handleGpsButtonPress}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3C75BE"
        />
      </TouchableOpacity>

      {outOfRange && (
        <View style={mapStyles.outOfRange}>
          <FontAwesome6 name="road-circle-exclamation" size={24} color="red" />
        </View>
      )}
    </View>
  );
};

export default DraggableMap;
