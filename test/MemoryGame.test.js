const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemoryGame", function () {
  let memoryGame;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    
    const MemoryGame = await ethers.getContractFactory("MemoryGame");
    memoryGame = await MemoryGame.deploy();
  });

  describe("Player Registration", function () {
    it("Should register a new player", async function () {
      await memoryGame.connect(player1).registerPlayer();
      
      const [level, score, bestScore] = await memoryGame.getPlayer(player1.address);
      expect(level).to.equal(1);
      expect(score).to.equal(0);
      expect(bestScore).to.equal(0);
    });

    it("Should prevent duplicate registration", async function () {
      await memoryGame.connect(player1).registerPlayer();
      
      await expect(
        memoryGame.connect(player1).registerPlayer()
      ).to.be.revertedWith("Player already registered");
    });

    it("Should emit PlayerRegistered event", async function () {
      await expect(memoryGame.connect(player1).registerPlayer())
        .to.emit(memoryGame, "PlayerRegistered")
        .withArgs(player1.address);
    });
  });

  describe("Level Progression", function () {
    beforeEach(async function () {
      await memoryGame.connect(player1).registerPlayer();
    });

    it("Should level up player", async function () {
      await memoryGame.connect(player1).levelUp();
      
      const [level] = await memoryGame.getPlayer(player1.address);
      expect(level).to.equal(2);
    });

    it("Should emit LevelUp event", async function () {
      await expect(memoryGame.connect(player1).levelUp())
        .to.emit(memoryGame, "LevelUp")
        .withArgs(player1.address, 2, 0);
    });
  });

  describe("Score Management", function () {
    beforeEach(async function () {
      await memoryGame.connect(player1).registerPlayer();
    });

    it("Should update player score with sufficient payment", async function () {
      const payment = ethers.parseEther("0.01");
      
      await memoryGame.connect(player1).updateProgress(500, { value: payment });
      
      const [, score, bestScore] = await memoryGame.getPlayer(player1.address);
      expect(score).to.equal(500);
      expect(bestScore).to.equal(500);
    });

    it("Should reject insufficient payment", async function () {
      const insufficientPayment = ethers.parseEther("0.005");
      
      await expect(
        memoryGame.connect(player1).updateProgress(500, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment to save progress");
    });

    it("Should update best score when new score is higher", async function () {
      const payment = ethers.parseEther("0.01");
      
      await memoryGame.connect(player1).updateProgress(500, { value: payment });
      await memoryGame.connect(player1).updateProgress(800, { value: payment });
      
      const [, score, bestScore] = await memoryGame.getPlayer(player1.address);
      expect(score).to.equal(800);
      expect(bestScore).to.equal(800);
    });

    it("Should keep best score when new score is lower", async function () {
      const payment = ethers.parseEther("0.01");
      
      await memoryGame.connect(player1).updateProgress(800, { value: payment });
      await memoryGame.connect(player1).updateProgress(500, { value: payment });
      
      const [, score, bestScore] = await memoryGame.getPlayer(player1.address);
      expect(score).to.equal(500);
      expect(bestScore).to.equal(800);
    });
  });

  describe("Player Queries", function () {
    it("Should return current player data", async function () {
      await memoryGame.connect(player1).registerPlayer();
      
      const [level, score, bestScore] = await memoryGame.connect(player1).getCurrentPlayer();
      expect(level).to.equal(1);
      expect(score).to.equal(0);
      expect(bestScore).to.equal(0);
    });

    it("Should fail for unregistered player", async function () {
      await expect(
        memoryGame.getPlayer(player1.address)
      ).to.be.revertedWith("Player not registered");
    });
  });

  describe("Leaderboard", function () {
    beforeEach(async function () {
      await memoryGame.connect(player1).registerPlayer();
      await memoryGame.connect(player2).registerPlayer();
      
      const payment = ethers.parseEther("0.01");
      await memoryGame.connect(player1).updateProgress(800, { value: payment });
      await memoryGame.connect(player2).updateProgress(600, { value: payment });
    });

    it("Should return leaderboard in descending order", async function () {
      const [addresses, scores] = await memoryGame.getLeaderboard(2);
      
      expect(addresses[0]).to.equal(player1.address);
      expect(addresses[1]).to.equal(player2.address);
      expect(scores[0]).to.equal(800);
      expect(scores[1]).to.equal(600);
    });

    it("Should limit results correctly", async function () {
      const [addresses, scores] = await memoryGame.getLeaderboard(1);
      
      expect(addresses.length).to.equal(1);
      expect(scores.length).to.equal(1);
      expect(addresses[0]).to.equal(player1.address);
    });
  });
});