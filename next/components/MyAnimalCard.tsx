import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import axios from "axios";

import { IAnimalData } from "../interfaces";
import { useAccount, useCaver } from "../hooks";
import { SALE_ANIMAL_TOKEN_ADDRESS } from "../caver";

interface MyAnimalCardProps extends IAnimalData {
  saleStatus: boolean;
}

const MyAnimalCard: FC<MyAnimalCardProps> = ({
  id,
  uri,
  price,
  saleStatus,
}) => {
  const [metadata, setMetaData] = useState<any>();
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myAnimalPrice, setMyAnimalPrice] = useState<string>(price);

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

  const onClickSell = async () => {
    try {
      if (!account || !saleStatus || !caver) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: SALE_ANIMAL_TOKEN_ADDRESS,
        gas: "3000000",
        data: saleAnimalToken.methods
          .setForSaleAnimalToken(id, caver?.utils.convertToPeb(sellPrice))
          .encodeABI(),
      });

      if (response.status) {
        setMyAnimalPrice(caver?.utils.convertToPeb(sellPrice));
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
      <Box mt={2}>
        {myAnimalPrice === "0" ? (
          <>
            <InputGroup>
              <Input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
              />
              <InputRightAddon children="Klay" />
            </InputGroup>
            <Button size="sm" mt={2} onClick={onClickSell}>
              Sell
            </Button>
          </>
        ) : (
          <Text d="inline-block">
            {caver?.utils.convertFromPeb(myAnimalPrice)} Klay
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyAnimalCard;
