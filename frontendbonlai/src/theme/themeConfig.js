const themeTokens = {
  // Main colors
  colorPrimary: "#FFB6C1", // Light Pink
  colorPrimaryHover: "#FF99AC", // Pink

  // Background and layout colors
  colorBgLayout: "#FFF0F5", // Lavender
  colorText: "#4A4A4A", // Dark Gray
  colorBorder: "#FFD1DC",
  colorFillSecondary: "#FFF5F8",

  // Additional theme colors
  colorSuccess: "#52c41a",
  colorWarning: "#faad14",
  colorError: "#ff4d4f",
  colorInfo: "#FFB6C1",

  // Component specific colors
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBgMask: "rgba(0, 0, 0, 0.45)",

  // Text colors
  colorTextSecondary: "#666666",
  colorTextTertiary: "#999999",
  colorTextDescription: "#8C8C8C",

  // Border colors
  colorSplit: "#FFD1DC",
  colorBorderSecondary: "#FFE4EA",
};

export const theme = {
  token: {
    ...themeTokens,
    fontFamily: `'Segoe UI', sans-serif`,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(255, 182, 193, 0.15)",

    // Component specific tokens
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    // Typography
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      paddingContentHorizontal: 24,
    },
    Card: {
      borderRadius: 12,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
  },
};
