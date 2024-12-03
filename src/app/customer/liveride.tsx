import { View, Text, Platform } from "react-native";
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
    }
  }, [id, emit, on, off]);

  return (
    <View style={rideStyles.container}>
      <SystemBars style="light" />
      <Text>LiveRide</Text>
    </View>
  );
};

export default memo(LiveRide);
