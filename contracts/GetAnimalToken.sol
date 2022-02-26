// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "MintAnimalToken.sol";
import "SaleAnimalToken.sol";

contract GetAnimalToken {
    MintAnimalToken public mintAnimalToken;
    SaleAnimalToken public saleAnimalToken;

    constructor (address _mintAnimalToken, address _saleAnimalToken) {
        mintAnimalToken = MintAnimalToken(_mintAnimalToken);
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
    }

    struct AnimalTokenData {
        uint id;
        string uri;
        uint price;
    }

    function getAnimalTokens(address _tokenOwner) public view returns (AnimalTokenData[] memory) {
        uint balanceLength = mintAnimalToken.balanceOf(_tokenOwner);

        require(balanceLength != 0, "Token owner did not have token.");

        AnimalTokenData[] memory animalTokens = new AnimalTokenData[](balanceLength);

        for(uint i = 0; i < balanceLength; i++) {
            uint tokenId = mintAnimalToken.tokenOfOwnerByIndex(_tokenOwner, i);
            string memory tokenURI = mintAnimalToken.tokenURI(tokenId);
            uint tokenPrice = saleAnimalToken.getTokenPrice(tokenId);

            animalTokens[i] = AnimalTokenData(tokenId, tokenURI, tokenPrice);
        }

        return animalTokens;
    }

    function getSaleAnimalTokens() public view returns (AnimalTokenData[] memory) {
        uint[] memory onSaleAnimalToken = saleAnimalToken.getOnSaleAnimalToken();

        require(onSaleAnimalToken.length > 0, "Not exist on sale token.");

        AnimalTokenData[] memory onSaleTokens = new AnimalTokenData[](onSaleAnimalToken.length);

        for(uint i = 0; i < onSaleAnimalToken.length; i++) {
            uint tokenId = onSaleAnimalToken[i];
            string memory tokenURI = mintAnimalToken.tokenURI(tokenId);
            uint tokenPrice = saleAnimalToken.getTokenPrice(tokenId);

            onSaleTokens[i] = AnimalTokenData(tokenId, tokenURI, tokenPrice);
        }

        return onSaleTokens;
    }
}