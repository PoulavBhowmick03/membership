// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClubMembership {
    address public owner;
    uint256 public membershipFee;
    mapping(address => bool) public members;
    mapping(address => uint256) public membershipPurchaseTime;
    address[] public memberAddresses;

    event MembershipPurchased(address member);
    event MembershipRevoked(address member);
    event MembershipFeeChanged(uint256 newFee);

    constructor(uint256 _membershipFee) {
        owner = msg.sender;
        membershipFee = _membershipFee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender], "Only members can call this function");
        _;
    }

    function purchaseMembership() external payable {
        require(!members[msg.sender], "You are already a member");
        require(msg.value == membershipFee, "Incorrect membership fee");

        members[msg.sender] = true;
        membershipPurchaseTime[msg.sender] = block.timestamp;
        memberAddresses.push(msg.sender);

        emit MembershipPurchased(msg.sender);
    }

    function revokeMembership(address _member) external onlyOwner {
        require(members[_member], "This address is not a member");

        members[_member] = false;
        delete membershipPurchaseTime[_member];

        // Remove member from memberAddresses array
        for (uint256 i = 0; i < memberAddresses.length; i++) {
            if (memberAddresses[i] == _member) {
                memberAddresses[i] = memberAddresses[
                    memberAddresses.length - 1
                ];
                memberAddresses.pop();
                break;
            }
        }

        // Calculate refund amount (you can modify this logic as needed)
        uint256 refundAmount = membershipFee;

        // Transfer the refund
        (bool success, ) = payable(_member).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit MembershipRevoked(_member);
    }

    function isMember(address _address) external view returns (bool) {
        return members[_address];
    }

    function changeMembershipFee(uint256 _newFee) external onlyOwner {
        membershipFee = _newFee;
        emit MembershipFeeChanged(_newFee);
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function getAllMembers() external view returns (address[] memory) {
        return memberAddresses;
    }
}
