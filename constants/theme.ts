type fontBoldness = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const theme = {
  colors: {
    primary: "#00C26F",
    primaryDark: "#00AC62",
    dark: "#3E3E3E",
    darkLight: "#E1E1E1",
    gray: "#E3E3E3",
    lightGray: "rgba(0, 0, 0, 0.07)",

    text: "#494949",
    textLight: "#7D7D7D",
    textDark: "#1D1D1D",

    rose: "#EF4444",
    roseLight: "#F87171"
  },
  fonts: {
    medium: 500 as fontBoldness,
    semibold: 600 as fontBoldness,
    bold: 700 as fontBoldness,
    extraBold: 800 as fontBoldness
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22
  }
}