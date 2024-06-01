import { BarLoader } from "react-spinners";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography, useTheme } from "@mui/material";
import fuzzysort from "fuzzysort";
import "./settings-select.css";
import { useCallback, useEffect, useState } from "react";

// Custom filter function for fuzzy search using fuzzysort
function fuzzyFilter(
  options: string[],
  { inputValue }: { inputValue: string },
) {
  if (!inputValue) return options;

  const results = fuzzysort.go(inputValue, options);
  return results.map((result: Fuzzysort.Result) => result.target);
}

type Props = {
  options: string[];
  name: string;
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
};

export const SettingsSelect = ({
  options,
  value,
  name,
  isLoading,
  onChange,
}: Props) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(value || "");

  // Sync settings value with local input value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = useCallback(
    (_: unknown, newValue: string) => {
      onChange(newValue);
      setInputValue(newValue);
    },
    [onChange, setInputValue],
  );

  if (isLoading) {
    return <BarLoader color={theme.palette.primary.light} />;
  }

  return (
    <Autocomplete
      disablePortal
      onChange={handleChange}
      className="settings-select"
      getOptionLabel={(option) => option}
      filterOptions={fuzzyFilter}
      value={inputValue || null}
      title={value}
      options={options}
      renderOption={(props, option) => (
        <li {...props} key={option as string}>
          <Typography>{option}</Typography>
        </li>
      )}
      style={{ maxWidth: "25vw" }}
      renderInput={(params) => (
        <TextField
          {...params}
          value={inputValue}
          inputProps={{
            ...params.inputProps,
            "aria-label": `Select ${name}`,
            style: {
              padding: "0",
              paddingInline: "1rem",
              width: "max-content",
            },
          }}
          InputProps={{
            ...params.InputProps,
            "aria-label": `Select ${name}`,
            style: {
              color: "inherit",
            },
          }}
        />
      )}
    />
  );
};
