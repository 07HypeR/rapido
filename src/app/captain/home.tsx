import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { getMyRides } from "@/service/rideService";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import CaptainHeader from "@/components/captain/CaptainHeader";

const Home = () => {
  useEffect(() => {
    getMyRides(false);
  }, []);

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      <CaptainHeader />
    </View>
  );
};

export default Home;
