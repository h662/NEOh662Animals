import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useCaver } from "../hooks";

const Home: NextPage = () => {
  const { caver } = useCaver();

  useEffect(() => console.log(caver), [caver]);

  return <Box>Home</Box>;
};

export default Home;
