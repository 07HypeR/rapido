import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { FC } from "react";
import { useWS } from "@/service/WSProvider";
import { rideStyles } from "@/styles/rideStyles";
import { commonStyles } from "@/styles/commonStyles";
import { vehicleIcons } from "@/utils/mapUtils";
import CustomText from "../shared/CustomText";

type VehicalType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
  vehical?: VehicalType;
  _id: string;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
}

const SearchingRideSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();

  return (
    <View>
      <View style={rideStyles?.headerContainer}>
        <View style={commonStyles.flexRowBetween}>
          {item?.vehical && (
            <Image
              source={vehicleIcons[item.vehical]?.icon}
              style={rideStyles?.rideIcon}
            />
          )}
          <View>
            <CustomText fontSize={10}>Looking for your</CustomText>
            <CustomText fontFamily="Medium" fontSize={12}>
              {item?.vehical} ride
            </CustomText>
          </View>
        </View>

        <ActivityIndicator color="black" size="small" />
      </View>
    </View>
  );
};

export default SearchingRideSheet;
