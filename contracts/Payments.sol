// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/airnode-protocol-v1/contracts/dapis/DapiReader.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Payments is ERC721, DapiReader, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    ERC20 public _ERC20;
    mapping(address => bytes32) public tokenDapiMapping;
    mapping(uint256 => uint256) public TokenIDtoPrice; 
    address[] allowedTokens;

constructor(address _dapiServer) DapiReader(_dapiServer) ERC721("Payment Receipt", "PRT") {

    }
    // @dev set dAPI names for tokens
    function setDapiName(address token, bytes32 DapiName)
        public
        onlyOwner
    {
        tokenDapiMapping[token] = DapiName;
    }
    // @dev add allowed tokens
    function addAllowedTokens(address token) public onlyOwner {
        allowedTokens.push(token);
    }
    // @dev check if token is allowed
    function tokenIsAllowed(address token) public view returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }
    // @dev get token price from dAPI name
    function getTokenPrice(address token) public view returns (uint256 tokenPriceUint256) {
        bytes32 DapiName = tokenDapiMapping[token];
        int224 value = IDapiServer(dapiServer).readDataFeedValueWithDapiName(
                DapiName
        );
        uint224 tokenPriceUint224 = uint224(value);
        tokenPriceUint256 = tokenPriceUint224;
        return tokenPriceUint256;
    }

    // @dev make the receipt
    function makeReceipt(uint256 tokenId, uint256 price) internal returns (uint256) {
        TokenIDtoPrice[tokenId] = price;
        return (price);
    }

    // @dev make the payment
    function Payment(address token, uint256 _tokenAmount) public returns(uint256) {
        require(_tokenAmount > 0, "amount cannot be 0");
        require(tokenIsAllowed(token), "token not allowed");
        if (tokenIsAllowed(token)) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            uint256 decimals = ERC20(token).decimals();
            uint256 _usdValue = (getTokenPrice(token) * _tokenAmount)/10**decimals;
            ERC20(token).transferFrom(msg.sender, address(this), _tokenAmount);
            _safeMint(msg.sender, tokenId);
            uint256 receipt = makeReceipt(tokenId, _usdValue);
            return receipt;
    }
    }

    // @dev check receipt withn tokenId
    function checkReceipt(uint256 tokenId) public view returns (uint256) {
        return (TokenIDtoPrice[tokenId]);
    }
    
    // @dev get all payments in USD
    function getTotalPayments() public view returns(uint256) {
        uint256 balance = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            uint256 tokenTokenBalance = ERC20(allowedTokens[i]).balanceOf(address(this));
            uint256 _usdValueToken = (getTokenPrice(allowedTokens[i]) * tokenTokenBalance)/10**ERC20(allowedTokens[i]).decimals();
            balance = balance + _usdValueToken;
        }
        return balance;
    }
    // @dev onlyOwner withdraw all tokens
    function ownerWithdrawFunds() public onlyOwner {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            ERC20(allowedTokens[i]).transfer(msg.sender, ERC20(allowedTokens[i]).balanceOf(address(this)));
        }
    }
}