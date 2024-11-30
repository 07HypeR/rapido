import { View, Text, Platform } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import LocationBar from "@/components/customer/LocationBar";
import { screenHeight } from "@/utils/Constants";
import DraggableMap from "@/components/customer/DraggableMap";

const androidHeights = [screenHeight * 0.2, screenHeight * 0.5];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5];

const Home = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    []
  );

  const [mapHeight, setMapHeight] = useState(snapPoints[1]);

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8;
    if (index === 1) {
      height = screenHeight * 0.5;
    }
    setMapHeight(height);
  }, []);

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />
      <LocationBar />
      <DraggableMap height={mapHeight} />
    </View>
  );
};

export default Home;
