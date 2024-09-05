import { Box, styled } from "@mui/material";

const ContentBorderWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  background: "#fcf7f4",
  boxShadow: " 1px 1px 0px 0px #0D1615 !important",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px 20px 20px 20px",
  flexDirection: "column",
}));

export default ContentBorderWrapper;
