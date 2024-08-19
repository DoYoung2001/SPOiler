import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "../api/weather";

export const useWeather = (lat, lon) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => {
      if (lat === null || lon === null) {
        throw new Error("Location not available");
      }
      return fetchWeather(lat, lon);
    },
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};