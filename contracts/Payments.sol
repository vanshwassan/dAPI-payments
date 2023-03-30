// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// @title dApp to accept ERC20 token payments and mint an NFT receipt with the USD value to the user.
/// @author @vanshwassan

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Payments is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    ERC20 public _ERC20;
    mapping(address => address) public tokenProxyMapping;
    mapping(uint256 => uint256) public TokenIDtoPrice; 
    address[] allowedTokens;

constructor() ERC721("Payment Receipt", "PRT") {

    }
    /// @notice set dAPI proxy for added tokens
    function setDapiProxy(address token, address _proxy)
        public
        onlyOwner
    {
        tokenProxyMapping[token] = _proxy;
    }
    /// @notice add allowed tokens
    function addAllowedTokens(address token) public onlyOwner {
        allowedTokens.push(token);
    }
    /// @notice check if token is allowed
    function tokenIsAllowed(address token) public view returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }
    /// @notice get token price from dAPI Proxy
    function getTokenPrice(address token) public view returns (uint256 tokenPriceUint256) {
        address proxy = tokenProxyMapping[token];
        int224 value;
        uint256 timestamp;
        (value, timestamp) = IProxy(proxy).read();
        uint224 tokenPriceUint224 = uint224(value);
        tokenPriceUint256 = tokenPriceUint224;
    }

    /// @notice make the receipt
    function makeReceipt(uint256 tokenId, uint256 price) internal returns (uint256) {
        TokenIDtoPrice[tokenId] = price;
        return (price);
    }

    /// @notice make the payment
    function Payment(address token, uint256 _tokenAmount) public returns(uint256) {
        require(_tokenAmount > 0, "amount cannot be 0");
        require(tokenIsAllowed(token), "token not allowed");
        if (tokenIsAllowed(token)) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            uint256 decimals = ERC20(token).decimals();
            uint256 tokenPriceUint256 = getTokenPrice(token);
            uint256 _usdValue = (tokenPriceUint256 * _tokenAmount)/10**decimals;
            ERC20(token).transferFrom(msg.sender, address(this), _tokenAmount);
            _safeMint(msg.sender, tokenId);
            uint256 receipt = makeReceipt(tokenId, _usdValue);
            return receipt;
    }
    }

    /// @notice check receipt withn tokenId
    function checkReceipt(uint256 tokenId) public view returns (uint256) {
        return (TokenIDtoPrice[tokenId]);
    }
    
    /// @notice get all payments in USD
    function getContractBalance() public view returns(uint256) {
        uint256 balance = 0;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            uint256 tokenTokenBalance = ERC20(allowedTokens[i]).balanceOf(address(this));
            uint256 _usdValueToken = (getTokenPrice(allowedTokens[i]) * tokenTokenBalance)/10**ERC20(allowedTokens[i]).decimals();
            balance = balance + _usdValueToken;
        }
        return balance;
    }
    /// @notice onlyOwner withdraw all tokens
    function ownerWithdrawFunds() public onlyOwner {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            ERC20(allowedTokens[i]).transfer(msg.sender, ERC20(allowedTokens[i]).balanceOf(address(this)));
        }
    }
}