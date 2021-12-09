import React, { FC } from "react";
import Box from "../Box";
import Button from "../Button";
import Text from "../Text";

export interface ControlProps {
  rows: number;
  cols: number;
  onReset: () => void;
  onChangeRow: (newRow: number) => void;
  onChangeCol: (newCol: number) => void;
  user: any;
}

const Control: FC<ControlProps> = ({ onReset, user }) => (
  <Box inlineSize="100%" style={{ margin: "0 5px" }} justifyContent="space-between">
    <Button onClick={onReset}>
      <Text fontSize={16} textTransform="capitalize">
        new game
      </Text>
    </Button>
    <Box>
      <Text color="primary" fontSize={16} textTransform="capitalize">
        {user.name}
      </Text>
    </Box>
  </Box>
);

export default React.memo(Control);
