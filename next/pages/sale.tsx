import { Grid } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SaleAnimalCard from "../components/SaleAnimalCard";
import { useCaver } from "../hooks";
import { IAnimalData } from "../interfaces";

const Sale: NextPage = () => {
  const [onSaleTokens, seOnSaleTokens] = useState<IAnimalData[]>();

  const { getAnimalToken } = useCaver();

  const getOnSaleTokens = async () => {
    try {
      const response = await getAnimalToken.methods
        .getSaleAnimalTokens()
        .call();

      seOnSaleTokens(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!getAnimalToken) return;

    getOnSaleTokens();
  }, [getAnimalToken]);

  return (
    <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
      {onSaleTokens?.map((v, i) => {
        return (
          <SaleAnimalCard
            key={i}
            id={v.id}
            uri={v.uri}
            price={v.price}
            getOnSaleTokens={getOnSaleTokens}
          />
        );
      })}
    </Grid>
  );
};

export default Sale;
