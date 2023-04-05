import React, { useState } from "react";
import { Box, Grid, Autocomplete,TextField } from "@mui/material";
import usePlacesAutocomplete, {
    getDetails,
    getGeocode,
    getLatLng,
    getZipCode,
} from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    libraries: ["places"],
});
const [selected, setSelected] = useState("");
  return (
    <div>
            <Box sx={{ backgroundColor: "red" }}>
                <Grid>
                  {isLoaded? <PlacesAutoComplete setSelected={setSelected} selected={selected}/>:null}
                </Grid>
            </Box>
        </div>
  )
}
export default App
const PlacesAutoComplete = ({ setSelected, selected }) => {
  const {
      ready,
      value,
      setValue,
      suggestions: { data, loading, status },
      clearSuggestions,
  } = usePlacesAutocomplete();
  const handleSelect = async (adress) =>{
    setValue(adress, false);
    clearSuggestions();

    const results = await getGeocode({address});
  const [coords, setCoords] = useState({ lat: "", lng: "" });

    setCoords(await getLatLng(results[0]))
    console.log(coords)
  }
  return (
      <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={data.map(d => {
            return d.description
          })}
          onSelect={handleSelect}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Location Name" value={selected} onChange={(e)=>setValue(e.target.value)}/>}
          disabled ={!ready}
      />
  );
};