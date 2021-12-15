pragma solidity >0.4.0 < 0.9.0;
contract Ownable{
    address payable public owner;
    modifier onlyOwner(){
        require(msg.sender == owner, "Only onwer");
        _;
    }
    constructor(){
    owner = payable(msg.sender);
  }
}