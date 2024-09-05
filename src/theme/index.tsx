import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Shadows, ThemeOptions } from "@mui/material/styles";

const lightThemeOptions: ThemeOptions = {
  shadows: Array(25).fill("none") as Shadows,
  typography: {
    fontFamily: ["Geologica", "Roboto", '"Helvetica Neue"', "Arial"].join(","),
    fontSize: 16,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#FED3E7",
    },
    secondary: {
      main: "#D3FBFE",
    },
    background: {
      default: "#F7E8F6",
    },
    text: {
      primary: "#0D1615",
    },
    warning: {
      main: "#FEF2D3",
    },
    info: {
      main: "#FFFFFF",
    },
    success: {
      main: "#FEF2D3",
    },
    divider: "#0D1615",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "transparent",
        },
        root: {
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: 500,
          lineHeight: "25px",
          letterSpacing: "0.07px",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          whiteSpace: "nowrap",
        },
        sizeLarge: {
          paddingTop: "16px",
          paddingBottom: "16px",
        },
        sizeSmall: {
          minWidth: "auto",
          padding: "5px 10px",
        },
      },
      variants: [
        {
          props: { variant: "contained" },
          style: {
            boxShadow: "1px 1px 0px 0px #0D1615",
            borderRadius: "10px",
            border: "1px solid #0D1615",
            fontSize: "0.875rem",
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          boxShadow: "1px 1px 0px 0px #0D1615",
          borderRadius: "50px",
          border: "1px solid #0D1615",
          fontSize: "0.875rem",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          width: "100%",
          borderRadius: "10px 10px 0 0",
          letterSpacing: "0.07",
          height: "90px",
          fontSize: "12px !important",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          fontSize: "12px !important",
          textTransform: "none",
          paddingTop: "20px",
          paddingBottom: "20px",
          color: "#FED3E7",

          "& svg": {
            color: "#FED3E7",
          },

          "&.Mui-selected": {
            color: "#000",
            fontSize: "12px !important",

            "& svg": {
              color: "#000",
            },
          },
        },
      },
    },
  },
};

const theme = createTheme(lightThemeOptions);

interface Props {
  children: React.ReactNode;
}

const MaterialProvider = ({ children }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MaterialProvider;
