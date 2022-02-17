// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "MintAnimalToken.sol";

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalToken;

    constructor (address _mintAnimalToken) {
        mintAnimalToken = MintAnimalToken(_mintAnimalToken);
    }
    
    mapping(uint256 => uint256) public tokenPrices;

    uint[] public onSaleAnimalToken;

    function setForSaleAnimalToken(uint _tokenId, uint _price) public {
        address tokenOwner = mintAnimalToken.ownerOf(_tokenId);

        require(tokenOwner == msg.sender, "Caller is not animal token owner.");
        require(_price > 0, "Price is zero is lower.");
        require(tokenPrices[_tokenId] == 0, "This animal token is already on sale.");
        require(mintAnimalToken.isApprovedForAll(tokenOwner, address(this)), "Animal token owner did not approve token.");

        tokenPrices[_tokenId] = _price;

        onSaleAnimalToken.push(_tokenId);
    }

    function purchaseAnimalToken(uint _tokenId) public payable {
        uint price = tokenPrices[_tokenId];
        address tokenOwner = mintAnimalToken.ownerOf(_tokenId);

        require(price > 0, "This animal token not sale.");
        require(price <= msg.value, "Caller sent lower than price.");
        require(tokenOwner != msg.sender, "Caller is animal token owner.");

        payable(tokenOwner).transfer(msg.value);
        mintAnimalToken.safeTransferFrom(tokenOwner, msg.sender, _tokenId);

        tokenPrices[_tokenId] = 0;

        for(uint i = 0; i < onSaleAnimalToken.length; i++) {
            if(tokenPrices[onSaleAnimalToken[i]] == 0) {
                onSaleAnimalToken[i] = onSaleAnimalToken[onSaleAnimalToken.length - 1];
                onSaleAnimalToken.pop();
            }
        }
    }
}