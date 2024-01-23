module.exports = ({ config }) => {
  return {
    ...config,
    plugins: [
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken:
            process.env.MAPBOX_SECRET_NATIVE_SDK_KEY || process.env.EXPO_PUBLIC_DEV_MAPBOX_SECRET_NATIVE_SDK_KEY,
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission: "Show current location on map.",
        },
      ],
    ],
  };
};
