import { useEffect, useState } from "react";
import Caver, { Contract } from "caver-js";
import {
  GET_ANIMAL_TOKEN_ABI,
  GET_ANIMAL_TOKEN_ADDRESS,
  MINT_ANIMAL_TOKEN_ABI,
  MINT_ANIMAL_TOKEN_ADDRESS,
  SALE_ANIMAL_TOKEN_ABI,
  SALE_ANIMAL_TOKEN_ADDRESS,
} from "../caver";

export const useAccount = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      const response = await window.klaytn.enable();

      setAccount(response[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (window.klaytn) {
      getAccount();
    }
  }, []);

  return { account };
};

export const useCaver = () => {
  const [caver, setCaver] = useState<Caver>();
  const [mintAnimalToken, setMintAnimalToken] = useState<Contract>();
  const [saleAnimalToken, setSaleAnimalToken] = useState<Contract>();
  const [getAnimalToken, setGetAnimalToken] = useState<Contract>();

  useEffect(() => {
    setCaver(new Caver(window.klaytn));
  }, []);

  useEffect(() => {
    if (!caver) return;

    setMintAnimalToken(
      caver.contract.create(MINT_ANIMAL_TOKEN_ABI, MINT_ANIMAL_TOKEN_ADDRESS)
    );
    setSaleAnimalToken(
      caver.contract.create(SALE_ANIMAL_TOKEN_ABI, SALE_ANIMAL_TOKEN_ADDRESS)
    );
    setGetAnimalToken(
      caver.contract.create(GET_ANIMAL_TOKEN_ABI, GET_ANIMAL_TOKEN_ADDRESS)
    );
  }, [caver]);

  return { caver, mintAnimalToken, saleAnimalToken, getAnimalToken };
};
