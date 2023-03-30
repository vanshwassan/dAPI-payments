// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/// @title Basic openzeppelin ERC20 Token.
/// @author @vanshwassan

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WMATIC is ERC20 {
    constructor() public ERC20("Wrapped Matic", "WMATIC") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}