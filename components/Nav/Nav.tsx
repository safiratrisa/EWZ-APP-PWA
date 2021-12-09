import Box from "../Box";
import { GrGamepad, GrAchievement } from "react-icons/gr";
import styled from "styled-components";
import { defaultPalette } from "../../themes/default/default";
import React from "react";
import Link from "next/link";

const IcGrAchievment = styled(GrAchievement).withConfig({
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<any>`
  path {
    stroke: ${(props) => (props.active ? defaultPalette.tile16 : defaultPalette["primary"])};
  }
`;

const IcGrGamepad = styled(GrGamepad).withConfig({
  shouldForwardProp: (prop) => !["active"].includes(prop),
})<any>`
  path {
    stroke: ${(props) => (props.active ? defaultPalette.tile16 : defaultPalette["primary"])};
  }
`;

const Nav: React.FC<{ active: "game" | "achivement" }> = ({ active }) => {
  return (
    <Box
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 90,
      }}
    >
      <Box style={{ marginRight: 30 }}>
        <Link href="/" passHref>
          <a aria-label="Game">
            <IcGrGamepad active={active === "game"} fontSize={35} />
          </a>
        </Link>
      </Box>
      <Box style={{ marginLeft: 30 }}>
        <Link href="/achivement" passHref>
          <a aria-label="Achivement">
            <IcGrAchievment active={active === "achivement"} fontSize={35} />
          </a>
        </Link>
      </Box>
    </Box>
  );
};

export default Nav;
