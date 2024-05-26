import { BarLoader } from "react-spinners";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography, useTheme } from "@mui/material";
import fuzzysort from "fuzzysort";
import "./settings-select.css";

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
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
};
export const SettingsSelect = ({
  options,
  value,
  isLoading,
  onChange,
}: Props) => {
  const theme = useTheme();

  if (isLoading) {
    return <BarLoader color={theme.palette.primary.light} />;
  }

  return (
    <Autocomplete
      disablePortal
      onChange={(_: unknown, value: string) => {
        if (value) {
          onChange(value);
        }
      }}
      className="settings-select"
      filterOptions={fuzzyFilter}
      value={value}
      options={options}
      renderOption={(props, option) => (
        <Typography {...props}>{option}</Typography>
      )}
      style={{ maxWidth: "15vw" }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            disabled={false}
            inputProps={{
              ...params.inputProps,
              style: {
                padding: "0",
                paddingInline: "1rem",
                width: "max-content",
              },
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                color: "inherit",
              },
            }}
            focused
          />
        );
      }}
    />
  );
};
