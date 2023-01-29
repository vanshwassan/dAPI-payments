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

constructor(address _dapiServer, address _ERC20Address) DapiReader(_dapiServer) ERC721("Payment Receipt", "PRT") {
        _ERC20 = ERC20(_ERC20Address);
    }

    function setDapiName(address token, bytes32 DapiName)
        public
        onlyOwner
    {
        tokenDapiMapping[token] = DapiName;
    }

    function getTokenPrice(address token) public view returns (uint256 tokenPriceUint256) {
        bytes32 DapiName = tokenDapiMapping[token];
        int224 value = IDapiServer(dapiServer).readDataFeedValueWithDapiName(
                DapiName
        );
        uint224 tokenPriceUint224 = uint224(value);
        tokenPriceUint256 = tokenPriceUint224;
        return tokenPriceUint256;
    }


    function makeReceipt(uint256 tokenId, uint256 price) internal returns (uint256) {
        TokenIDtoPrice[tokenId] = price;
        return (price);
    }

    // function to make the payment
    function Payment(address token, uint256 _tokenAmount) public returns(uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        uint256 decimals = _ERC20.decimals();
        uint256 _usdValue = (getTokenPrice(token) * _tokenAmount)/10**decimals;
        _ERC20.transferFrom(msg.sender, address(this), _tokenAmount);
        _safeMint(msg.sender, tokenId);
        uint256 receipt = makeReceipt(tokenId, _usdValue);
        return receipt;
    }

    
    function checkReceipt(uint256 tokenId) public view returns (uint256) {
        return (TokenIDtoPrice[tokenId]);
    }
    
    // Function to get the total payments
    function getTotalPayments() view public returns(uint) {
        uint256 totalPayments = _ERC20.balanceOf(address(this));
        return totalPayments;
    }

    function ownerWithdrawFunds() public onlyOwner {
        _ERC20.transfer(msg.sender, _ERC20.balanceOf(address(this)));
    }
}