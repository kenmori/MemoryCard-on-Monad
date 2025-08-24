// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract MemoryGame {
    struct Player {
        uint256 level;
        uint256 score;
        uint256 bestScore;
        bool exists;
    }
    
    mapping(address => Player) public players;
    address[] public playerAddresses;
    
    event LevelUp(address indexed player, uint256 newLevel, uint256 score);
    event ScoreUpdate(address indexed player, uint256 newScore, uint256 bestScore);
    event PlayerRegistered(address indexed player);
    
    modifier playerExists() {
        require(players[msg.sender].exists, "Player not registered");
        _;
    }
    
    function registerPlayer() external {
        require(!players[msg.sender].exists, "Player already registered");
        
        players[msg.sender] = Player({
            level: 1,
            score: 0,
            bestScore: 0,
            exists: true
        });
        
        playerAddresses.push(msg.sender);
        
        emit PlayerRegistered(msg.sender);
    }
    
    function updateProgress(uint256 _score) external payable playerExists {
        require(msg.value >= 0.01 ether, "Insufficient payment to save progress");
        
        Player storage player = players[msg.sender];
        player.score = _score;
        
        if (_score > player.bestScore) {
            player.bestScore = _score;
        }
        
        emit ScoreUpdate(msg.sender, _score, player.bestScore);
    }
    
    function levelUp() external playerExists {
        Player storage player = players[msg.sender];
        player.level += 1;
        
        emit LevelUp(msg.sender, player.level, player.score);
    }
    
    function getPlayer(address _player) external view returns (uint256 level, uint256 score, uint256 bestScore) {
        require(players[_player].exists, "Player not registered");
        Player memory player = players[_player];
        return (player.level, player.score, player.bestScore);
    }
    
    function getCurrentPlayer() external view returns (uint256 level, uint256 score, uint256 bestScore) {
        require(players[msg.sender].exists, "Player not registered");
        Player memory player = players[msg.sender];
        return (player.level, player.score, player.bestScore);
    }
    
    function getPlayerCount() external view returns (uint256) {
        return playerAddresses.length;
    }
    
    function getLeaderboard(uint256 _limit) external view returns (address[] memory addresses, uint256[] memory scores) {
        uint256 limit = _limit > playerAddresses.length ? playerAddresses.length : _limit;
        
        addresses = new address[](limit);
        scores = new uint256[](limit);
        
        address[] memory sortedAddresses = new address[](playerAddresses.length);
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            sortedAddresses[i] = playerAddresses[i];
        }
        
        for (uint256 i = 0; i < sortedAddresses.length - 1; i++) {
            for (uint256 j = 0; j < sortedAddresses.length - i - 1; j++) {
                if (players[sortedAddresses[j]].bestScore < players[sortedAddresses[j + 1]].bestScore) {
                    address temp = sortedAddresses[j];
                    sortedAddresses[j] = sortedAddresses[j + 1];
                    sortedAddresses[j + 1] = temp;
                }
            }
        }
        
        for (uint256 i = 0; i < limit; i++) {
            addresses[i] = sortedAddresses[i];
            scores[i] = players[sortedAddresses[i]].bestScore;
        }
        
        return (addresses, scores);
    }
    
    function withdraw() external {
        require(msg.sender == owner(), "Only owner can withdraw");
        payable(owner()).transfer(address(this).balance);
    }
    
    function owner() public view returns (address) {
        return address(this);
    }
}