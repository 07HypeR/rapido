import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/utils/Constants";
import CustomText from "@/components/shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import { uiStyles } from "@/styles/uiStyles";
import LocationInput from "./LocationInput";
import { getPlacesSuggestions } from "@/utils/mapUtils";
import { locationStyles } from "@/styles/locationStyles";
import { useUserStore } from "@/store/useStore";

const Selectlocations = () => {
  const { location } = useUserStore();
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropCoords, setDropCoords] = useState<any>(null);
  const [drop, setDrop] = useState("");
  const [locations, setLocations] = useState([]);
  const [focusedInput, setFocusedInput] = useState("drop");
  const [modalTitle, setModalTitle] = useState("drop");
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  const fetchLocation = async (query: string) => {
    if (query?.length > 4) {
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    }
  };

  useEffect(() => {
    if (location) {
      setPickupCoords(location);
      setPickup(location?.address);
    }
  }, [location]);

  const renderLocations = ({ item }: any) => {
    return <View></View>;
  };

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />
      <SafeAreaView />
      <TouchableOpacity
        style={commonStyles.flexRow}
        onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={Colors.iosColor} />
        <CustomText fontFamily="Regular" style={{ color: Colors.iosColor }}>
          Back
        </CustomText>
      </TouchableOpacity>

      <View style={uiStyles.locationInputs}>
        <LocationInput
          placeholder="Search Pickup Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);
            fetchLocation(text);
          }}
          onFocus={() => setFocusedInput("pickup")}
        />
        <LocationInput
          placeholder="Search Drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setPickup(text);
            fetchLocation(text);
          }}
          onFocus={() => setFocusedInput("drop")}
        />

        <CustomText
          fontFamily="Medium"
          fontSize={10}
          style={uiStyles.suggestionText}>
          {focusedInput} suggestions
        </CustomText>
      </View>

      <FlatList
        data={locations}
        renderItem={renderLocations}
        keyExtractor={(item: any) => item?.place_id}
        initialNumToRender={5}
        windowSize={5}
        ListFooterComponent={
          <TouchableOpacity
            style={[commonStyles.flexRow, locationStyles.container]}
            onPress={() => {
              setModalTitle(focusedInput);
              setMapModalVisible(true);
            }}>
            <Image
              source={require("@/assets/icons/map_pin.png")}
              style={uiStyles.mapPinIcon}
            />
            <CustomText fontFamily="Medium" fontSize={12}>
              Select from Map
            </CustomText>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default Selectlocations;
