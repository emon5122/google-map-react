import { useState, useCallback, useMemo } from "react";
import { Box, Grid, Autocomplete, TextField } from "@mui/material";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

type Coords = {
  lat: number;
  lng: number;
};

const libraries: (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[] = ["places"];
const PlacesAutoComplete = () => {
  const [coords, setCoords] = useState<Coords | undefined>();
  const {
    ready,
    setValue,
    suggestions: { data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = useCallback(
    async (address: string) => {
      setValue(address, false);
      clearSuggestions();
      if (address.length < 2) return;
      try {
        const results = await getGeocode({ address });
        if (results.length) {
          setCoords(getLatLng(results[0]));
        }
      } catch (e) {
        return;
      }
    },
    [clearSuggestions, getGeocode, getLatLng, setValue]
  );

  const options = useMemo(
    () => data.map(({ description }) => description),
    [data]
  );

  return (
    <Grid>
      <p>Lat: {coords?.lat}</p>
      <p>Lng: {coords?.lng}</p>
      <Grid>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={options}
          onSelect={(e: any) => {
            setValue(e.target.value);
            handleSelect(e.target.value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Location Name" />
          )}
          disabled={!ready}
        />
      </Grid>
    </Grid>
  );
};

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });
  return (
    <div>
      <Box>{isLoaded && <PlacesAutoComplete />}</Box>
    </div>
  );
}

export default App;
