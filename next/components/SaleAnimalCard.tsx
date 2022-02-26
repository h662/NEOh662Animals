import { Box, Button, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { SALE_ANIMAL_TOKEN_ADDRESS } from "../caver";
import { useAccount, useCaver } from "../hooks";
import { IAnimalData } from "../interfaces";

interface SaleAnimalCardProps extends IAnimalData {
  getOnSaleTokens: () => Promise<void>;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({
  id,
  uri,
  price,
  getOnSaleTokens,
}) => {
  const [metadata, setMetaData] = useState<any>();

  const { account } = useAccount();
  const { caver, saleAnimalToken } = useCaver();

  const getMetadata = async () => {
    try {
      const response = await axios.get(uri);

      setMetaData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!account) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: SALE_ANIMAL_TOKEN_ADDRESS,
        gas: "3000000",
        data: saleAnimalToken.methods.purchaseAnimalToken(id).encodeABI(),
        value: price,
      });

      if (response.status) {
        getOnSaleTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMetadata();
  }, []);

  return (
    <Box>
      {metadata && <Image src={metadata.image} alt="Animal Card" />}
      <Box>
        <Text d="inline-block">{caver?.utils.convertFromPeb(price)} Klay</Text>
        <Button size="sm" ml={2} onClick={onClickBuy}>
          Buy
        </Button>
      </Box>
    </Box>
  );
};

export default SaleAnimalCard;
