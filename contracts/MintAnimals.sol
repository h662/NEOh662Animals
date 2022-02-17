// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MintAnimals is ERC721Enumerable {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    mapping(uint => string) tokenURIs;

    function tokenURI(uint _tokenId) override public view returns (string memory) {
        return string(
            abi.encodePacked("https://allbaaam.mypinata.cloud/ipfs/", tokenURIs[_tokenId])
        );
    }
}