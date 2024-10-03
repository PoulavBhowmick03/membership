// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClubMembership {
    address public owner;
    enum MembershipTier {
        Basic,
        Silver,
        Gold,
        Platinum
    }
    struct MembershipFee {
        uint256 fee;
        bool isActive;
        uint256 duration;
    }

    struct Member {
        bool isMember;
        uint256 expiry_date;
        MembershipTier tier;
    }
    mapping(MembershipTier => MembershipFee) public tierFees;
    mapping(address => Member) public members;
    address[] public memberAddresses;

    event MembershipPurchased(
        address member,
        MembershipTier tier,
        uint256 expirationTime
    );
    event MembershipRevoked(address member);
    event MembershipFeeChanged(
        MembershipTier tier,
        uint256 newFee,
        uint256 newDuration
    );
    event MembershipTierChanged(
        address member,
        MembershipTier newTier,
        uint256 newExpirationTime
    );
    event MembershipRenewed(address member, uint256 newExpirationTime);
    modifier onlyActiveMember() {
        require(
            isActiveMember(msg.sender),
            "Only active members can call this function"
        );
        _;
    }

    function isActiveMember(address _member) public view returns (bool) {
        return
            members[_member].isMember &&
            members[_member].expiry_date > block.timestamp;
    }

    constructor(
        uint256 _membershipFeeBasic,
        uint256 _membershipFeeSilver,
        uint256 _membershipFeeGold,
        uint256 _membershipFeePlatinum
    ) {
        owner = msg.sender;
        tierFees[MembershipTier.Basic] = MembershipFee(
            _membershipFeeBasic,
            true,
            0
        );
        tierFees[MembershipTier.Silver] = MembershipFee(
            _membershipFeeSilver,
            true,
            0
        );
        tierFees[MembershipTier.Gold] = MembershipFee(
            _membershipFeeGold,
            true,
            0
        );
        tierFees[MembershipTier.Platinum] = MembershipFee(
            _membershipFeePlatinum,
            true,
            0
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyMember() {
        require(
            members[msg.sender].isMember,
            "Only members can call this function"
        );
        _;
    }

    function purchaseMembership(
        MembershipTier _tier,
        uint256 quater
    ) external payable {
        require(!members[msg.sender].isMember, "You are already a member");
        require(tierFees[_tier].isActive, "This membership tier is not active");
        require(msg.value == tierFees[_tier].fee, "Incorrect membership fee");

        uint256 expirationTime = block.timestamp + 3 * quater;
        members[msg.sender] = Member(true, expirationTime, _tier);
        memberAddresses.push(msg.sender);

        emit MembershipPurchased(msg.sender, _tier, expirationTime);
    }

    function upgradeMembership(
        MembershipTier _newTier,
        uint256 quater
    ) external payable onlyMember {
        require(
            _newTier > members[msg.sender].tier,
            "Can only upgrade to a higher tier"
        );
        require(
            tierFees[_newTier].isActive,
            "This membership tier is not active"
        );
        uint256 remainingTime = members[msg.sender].expiry_date -
            block.timestamp;
        uint256 remainingValue = (remainingTime *
            tierFees[members[msg.sender].tier].fee) /
            tierFees[members[msg.sender].tier].duration;
        uint256 newCost = tierFees[_newTier].fee;
        uint256 feeDifference = newCost > remainingValue
            ? newCost - remainingValue
            : 0;
        require(msg.value == feeDifference, "Incorrect upgrade fee");

        uint256 newExpirationTime = block.timestamp + 3 * quater;
        members[msg.sender].tier = _newTier;
        members[msg.sender].expiry_date = newExpirationTime;

        emit MembershipTierChanged(msg.sender, _newTier, newExpirationTime);
    }

    function revokeMembership(address _member) external payable onlyOwner {
        require(members[_member].isMember, "This address is not a member");
        MembershipTier tierToRefund = members[_member].tier;
        uint256 remainingTime = members[_member].expiry_date > block.timestamp
            ? members[_member].expiry_date - block.timestamp
            : 0;

        delete members[_member];

        for (uint256 i = 0; i < memberAddresses.length; i++) {
            if (memberAddresses[i] == _member) {
                memberAddresses[i] = memberAddresses[
                    memberAddresses.length - 1
                ];
                memberAddresses.pop();
                break;
            }
        }

        uint256 refundAmount = (remainingTime * tierFees[tierToRefund].fee) /
            tierFees[tierToRefund].duration;
        if (refundAmount > 0) {
            (bool success, ) = payable(_member).call{value: refundAmount}("");
            require(success, "Refund transfer failed");
        }

        emit MembershipRevoked(_member);
    }

    function renewMembership() external payable onlyActiveMember {
        MembershipTier currentTier = members[msg.sender].tier;
        require(
            msg.value == tierFees[currentTier].fee,
            "Incorrect renewal fee"
        );

        members[msg.sender].expiry_date += tierFees[currentTier].duration;

        emit MembershipRenewed(msg.sender, members[msg.sender].expiry_date);
    }

    function getMemberTier(
        address _member
    ) external view returns (MembershipTier) {
        require(members[_member].isMember, "This address is not a member");
        return members[_member].tier;
    }

    function changeMembershipFee(
        MembershipTier _tier,
        uint256 _newFee,
        uint256 _newDuration
    ) external onlyOwner {
        tierFees[_tier].fee = _newFee;
        tierFees[_tier].duration = _newDuration;
        emit MembershipFeeChanged(_tier, _newFee, _newDuration);
    }

    function getMemberExpirationTime(
        address _member
    ) external view returns (uint256) {
        require(members[_member].isMember, "This address is not a member");
        return members[_member].expiry_date;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function getAllMembers() external view returns (address[] memory) {
        return memberAddresses;
    }

    function get_block() external view returns (uint256) {
        return block.timestamp;
    }
}
