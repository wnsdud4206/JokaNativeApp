import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "c3d64abd985a5e5d422ceeefa8ed7137";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
  Haze: "day-haze",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
      // } = await Location.getLastKnownPositionAsync({ accuracy: 5 });
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    Location.setGoogleApiKey("AIzaSyBrCqiddDH1pUKIXy_KRD2gqEpqjxJ9SBY");
    const place = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false },
    );
    setCity(place[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
    );
    const json = await response.json();
    console.log(json);
    setDays(json);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.weather.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={styles.main}>
                <Text style={styles.temp}>
                  {parseFloat(days.main.temp).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.main]} size={68} color="black" />
              </View>
              <Text style={styles.description}>{day.main}</Text>
              <Text style={styles.tinyText}>{day.description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e83a4",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
    // flex: 3,
    // backgroundColor: "#369bbc",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    fontWeight: "500",
  },
  tinyText: {
    fontSize: 20,
  },
});
