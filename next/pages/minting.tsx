import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { MINT_ANIMAL_TOKEN_ADDRESS } from "../caver";
import SuccessModal from "../components/SuccessModal";
import { useAccount, useCaver } from "../hooks";

const Minting: NextPage = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [uri, setUri] = useState<string>("");

  const { account } = useAccount();

  const { caver, mintAnimalToken } = useCaver();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onClickMint = async () => {
    try {
      if (!account) return;

      const response = await caver.klay.sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: account,
        to: MINT_ANIMAL_TOKEN_ADDRESS,
        gas: "3000000",
        data: mintAnimalToken.methods.mintAnimal(uri).encodeABI(),
      });

      if (response.status) {
        onOpen();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;

    if (
      account.toLocaleLowerCase() ===
      process.env.NEXT_PUBLIC_OWNER_ADDRESS!.toLocaleLowerCase()
    ) {
      setIsOwner(true);
    }
  }, [account]);

  return (
    <>
      <Flex flexDirection="column" justifyContent="center" minH="100vh">
        {isOwner ? (
          <>
            <InputGroup mx="auto" w="fit-content" mb={2}>
              <InputLeftAddon children="URI" />
              <Input value={uri} onChange={(e) => setUri(e.target.value)} />
            </InputGroup>
            <Button mx="auto" onClick={onClickMint}>
              Minting
            </Button>
          </>
        ) : (
          "notOwner"
        )}
      </Flex>
      <SuccessModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Minting;
