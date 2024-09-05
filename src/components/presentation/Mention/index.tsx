import { ReactComponent as MentionIcon } from "@/assets/svg/mention.svg";
import { Box, SvgIcon, styled } from "@mui/material";
import { BoxProps } from "@mui/system";
import { FC } from "react";

const Container = styled(Box)(() => ({
  width: "100%",
  background: "#FEF2D3",
  borderRadius: "10px",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  display: "flex",
  alignItems: "center",
  height: "65px",
  padding: "10px",

  "& svg": {
    marginRight: "8px",
  },
}));

const MentionContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const MentionTitle = styled(Box)(() => ({
  fontWeight: "500",
  fontSize: "14px",
  lineHeight: "17.5px",
  letterSpacing: "0.07",
  color: "#0D1615",
}));

const MentionSubTitle = styled(Box)(() => ({
  fontWeight: "300",
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.07",
  color: "#A99B76",
  marginTop: "4px",
}));

interface MentionProps extends BoxProps {
  title: string;
  subTitle?: string;
  withIcon?: boolean;
}

const Mention: FC<MentionProps> = ({ sx, withIcon, title, subTitle }) => {
  return (
    <Container sx={sx}>
      {withIcon && (
        <SvgIcon>
          <MentionIcon />
        </SvgIcon>
      )}
      <MentionContent>
        <MentionTitle>{title}</MentionTitle>
        {subTitle && <MentionSubTitle>{subTitle}</MentionSubTitle>}
      </MentionContent>
    </Container>
  );
};

export default Mention;
