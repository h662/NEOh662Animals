import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { MINT_ANIMAL_TOKEN_ADDRESS, SALE_ANIMAL_TOKEN_ADDRESS } from "../caver";
import MyAnimalCard from "../components/MyAnimalCard";
import { useAccount, useCaver } from "../hooks";
import { IAnimalData } from "../interfaces";

const Home: NextPage = () => {
  const [animalTokens, setAnimalTokens] = useState<IAnimalData[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const { account } = useAccount();

  const { getAnimalToken, mintAnimalToken, caver } = useCaver();

  const getAnimalTokens = async () => {
    try {
      const response = await getAnimalToken.methods
        .getAnimalTokens(account)
        .call();

      setAnimalTokens(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getSaleStatus = async () => {
    try {
      const response = await mintAnimalToken.methods
        .isApprovedForAll(account, SALE_ANIMAL_TOKEN_ADDRESS)
        .call();

      setSaleStatus(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSaleStatus = async () => {
    try {
      if (!account) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: MINT_ANIMAL_TOKEN_ADDRESS,
        gas: "3000000",
        data: mintAnimalToken.methods
          .setApprovalForAll(SALE_ANIMAL_TOKEN_ADDRESS, !saleStatus)
          .encodeABI(),
      });

      if (response.status) {
        setSaleStatus(!status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account || !getAnimalToken) return;

    getAnimalTokens();
  }, [account, getAnimalToken]);

  useEffect(() => {
    if (!account || !mintAnimalToken) return;

    getSaleStatus();
  }, [account, mintAnimalToken]);

  return (
    <Flex
      minH="100vh"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Text d="inline-block">
          Sale Status : {saleStatus ? "True" : "False"}
        </Text>
        <Button
          size="xs"
          ml={2}
          colorScheme={saleStatus ? "red" : "blue"}
          onClick={onClickSaleStatus}
        >
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Box>
      <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={8}>
        {animalTokens?.map((v, i) => {
          return (
            <MyAnimalCard
              key={i}
              id={v.id}
              uri={v.uri}
              price={v.price}
              saleStatus={saleStatus}
            />
          );
        })}
      </Grid>
    </Flex>
  );
};

export default Home;
