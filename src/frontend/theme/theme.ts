import { createTheme, responsiveFontSizes } from "@mui/material";

// Define your color constants (using HSLA)

const COLORS = {
  // Primary
  PRIMARY_HUE: 196, // Solarized Blue Hue
  PRIMARY_SATURATION: 38,
  PRIMARY_MAIN_LIGHTNESS: 43, // Darker blue for stronger contrast
  PRIMARY_LIGHT_LIGHTNESS: 60,
  PRIMARY_DARK_LIGHTNESS: 26,

  // Secondary
  SECONDARY_HUE: 60, // Solarized Yellow Hue
  SECONDARY_SATURATION: 50,
  SECONDARY_MAIN_LIGHTNESS: 70, // Brighter yellow for accents
  SECONDARY_LIGHT_LIGHTNESS: 85,
  SECONDARY_DARK_LIGHTNESS: 50,

  // Neutrals
  BASE3_LIGHTNESS: 96,
  BASE2_LIGHTNESS: 92,

  // Text
  TEXT_PRIMARY_LIGHTNESS: 20, // Darker gray for main text
  TEXT_SECONDARY_LIGHTNESS: 8,
  TEXT_DISABLED_LIGHTNESS: 60,

  // Actions
  ACTION_HUE: 196, // Shifted hue towards blue (matching your primary)
  ACTION_SATURATION: 15, // Keeping the low saturation
  ACTION_LIGHTNESS: 80, // Reduced lightness for a darker hover
};

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: `hsla(${COLORS.PRIMARY_HUE}, ${COLORS.PRIMARY_SATURATION}%, ${COLORS.PRIMARY_MAIN_LIGHTNESS}%, 1)`,
        light: `hsla(${COLORS.PRIMARY_HUE}, ${COLORS.PRIMARY_SATURATION}%, ${COLORS.PRIMARY_LIGHT_LIGHTNESS}%, 1)`,
        dark: `hsla(${COLORS.PRIMARY_HUE}, ${COLORS.PRIMARY_SATURATION}%, ${COLORS.PRIMARY_DARK_LIGHTNESS}%, 1)`,
      },
      secondary: {
        main: `hsla(${COLORS.SECONDARY_HUE}, ${COLORS.SECONDARY_SATURATION}%, ${COLORS.SECONDARY_MAIN_LIGHTNESS}%, 1)`,
        light: `hsla(${COLORS.SECONDARY_HUE}, ${COLORS.SECONDARY_SATURATION}%, ${COLORS.SECONDARY_LIGHT_LIGHTNESS}%, 1)`,
        dark: `hsla(${COLORS.SECONDARY_HUE}, ${COLORS.SECONDARY_SATURATION}%, ${COLORS.SECONDARY_DARK_LIGHTNESS}%, 1)`,
      },
      background: {
        default: `hsla(0, 0%, ${COLORS.BASE3_LIGHTNESS}%, 1)`, // Light background
        paper: `hsla(0, 0%, ${COLORS.BASE2_LIGHTNESS}%, 1)`, // Paper background
      },
      // ... (other colors in your palette)
      text: {
        primary: `hsla(0, 0%, ${COLORS.TEXT_PRIMARY_LIGHTNESS}%, 1)`,
        secondary: `hsla(0, 0%, ${COLORS.TEXT_SECONDARY_LIGHTNESS}%, 1)`,
        disabled: `hsla(0, 0%, ${COLORS.TEXT_DISABLED_LIGHTNESS}%, 1)`,
      },
      action: {
        hover: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS + 10}%, 1)`, // Lighter for hover
        hoverOpacity: 0.08, // Opacity for hover effect on background
        selected: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS + 5}%, 1)`, // Slightly lighter for selected
        selectedOpacity: 0.16, // Opacity for selected effect on background
        focus: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS + 20}%, 1)`, // Even lighter for focus
        activatedOpacity: 0.12, // Opacity for activated effect on background
        disabled: `hsla(0, 0%, 0%, 0.26)`, // Standard disabled color
        disabledBackground: `hsla(0, 0%, 0%, 0.12)`, // Standard disabled background
      },
    },
    // ... your existing typography ...

    components: {
      // ... your existing component styles ...
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: `hsla(0, 0%, ${COLORS.BASE3_LIGHTNESS}%, 1)`, // Reuse background.default
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(odd)": {
              backgroundColor: `hsla(0, 0%, ${COLORS.BASE2_LIGHTNESS}%, 1)`,

              // Hover on ODD rows
              "&:hover": {
                backgroundColor: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS + 5}%, 1)`, // Adjust lightness for hover effect
              },
              // Focus on ODD rows
              "&:focus": {
                backgroundColor: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS}%, 1)`, // Slightly darker than hover
              },
            },

            "&:nth-of-type(even)": {
              backgroundColor: `hsla(0, 0%, ${COLORS.BASE3_LIGHTNESS}%, 1)`,

              // Hover on EVEN rows
              "&:hover": {
                backgroundColor: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS + 5}%, 1)`, // Same as odd row hover for consistency
              },
              // Focus on EVEN rows
              "&:focus": {
                backgroundColor: `hsla(${COLORS.ACTION_HUE}, ${COLORS.ACTION_SATURATION}%, ${COLORS.ACTION_LIGHTNESS}%, 1)`, // Same as odd row focus
              },
            },
          },
        },
      },
    },
  }),
);
