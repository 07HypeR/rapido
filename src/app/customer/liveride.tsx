import { View, Text, Platform, Alert } from "react-native";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRoute } from "@react-navigation/native";
import { screenHeight } from "@/utils/Constants";
import { useWS } from "@/service/WSProvider";
import { rideStyles } from "@/styles/rideStyles";
import { SystemBars } from "react-native-edge-to-edge";
import { resetAndNavigate } from "@/utils/Helpers";
import LiveTrackingMap from "@/components/customer/LiveTrackingMap";

const androidHeights = [screenHeight * 0.2, screenHeight * 0.5];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5];

const LiveRide = () => {
  const { on, off, emit } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const [captainCoords, setCaptainCoords] = useState<any>(null);
  const route = useRoute() as any;
  const params = route?.params || {};
  const id = params.id;

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    []
  );

  const [mapHeight, setMapHeight] = useState(snapPoints[0]);

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8;
    if (index == 1) {
      height = screenHeight * 0.5;
    }
    setMapHeight(height);
  }, []);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);

      on("rideData", (data) => {
        setRideData(data);
        if (data?.status === "SEARCHING_FOR_CAPTAIN") {
          emit("searchCaptain", id);
        }
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      });

      on("rideCanceled", (error) => {
        resetAndNavigate("/captain/home");
        Alert.alert("Ride Canceled");
      });

      on("error", (error) => {
        resetAndNavigate("/captain/home");
        Alert.alert("Oh dang! No Riders Found");
      });
    }

    return () => {
      off("rideData");
      off("rideUpdate");
      off("rideCanceled");
      off("error");
    };
  }, [id, emit, on, off]);

  useEffect(() => {
    if (rideData?.captain?._id) {
      emit("subscribeToCaptainLocation", rideData?.captain?._id);
      on("captainLocationUpdate", (data) => {
        setCaptainCoords(data?.coords);
      });
      return () => {
        off("captainLocationUpdate");
      };
    }
  }, [rideData]);

  return (
    <View style={rideStyles.container}>
      <SystemBars style="light" />
      {rideData && (
        <LiveTrackingMap
          height={mapHeight}
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          captain={
            captainCoords
              ? {
                  latitude: captainCoords.latitude,
                  longitude: captainCoords.longitude,
                  heading: captainCoords.heading,
                }
              : {}
          }
        />
      )}
    </View>
  );
};

export default memo(LiveRide);
