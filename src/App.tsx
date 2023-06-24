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
    const [selected, setSelected] = useState<string>("");
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
            const results = await getGeocode({ address });
            if (results.length) {
                setCoords(getLatLng(results[0]));
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
                    onSelect={async () => await handleSelect(selected)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Location Name"
                            value={selected}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setSelected(e.target.value);
                            }}
                        />
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
