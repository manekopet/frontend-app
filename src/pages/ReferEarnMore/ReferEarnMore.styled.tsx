import { Box, styled } from "@mui/material";

export const DetailModel = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: #f7e8f6 !important;
  border-radius: 5px;
  box-shadow: 24px;
  padding: 24px;

  .input-username {
    width: 100%;
  }
  .btn-submit {
    margin-top: 24px;
  }

  .title {
    font-size: 20px;
    padding-bottom: 24px;
  }
`;
