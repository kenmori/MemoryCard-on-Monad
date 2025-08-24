import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { MEMORY_GAME_CONTRACT } from '../contracts/MemoryGame';

export function useMemoryGameContract() {
  const { address: userAddress } = useAccount();
  const { writeContract, data: writeHash, error: writeError, isPending: isWritePending } = useWriteContract();

  const registerPlayer = async () => {
    if (!userAddress) throw new Error('Wallet not connected');
    
    return writeContract({
      address: MEMORY_GAME_CONTRACT.address,
      abi: MEMORY_GAME_CONTRACT.abi,
      functionName: 'registerPlayer',
    });
  };

  const updateProgress = async (score) => {
    if (!userAddress) throw new Error('Wallet not connected');
    
    return writeContract({
      address: MEMORY_GAME_CONTRACT.address,
      abi: MEMORY_GAME_CONTRACT.abi,
      functionName: 'updateProgress',
      args: [BigInt(score)],
      value: parseEther('0.01'),
    });
  };

  const levelUp = async () => {
    if (!userAddress) throw new Error('Wallet not connected');
    
    return writeContract({
      address: MEMORY_GAME_CONTRACT.address,
      abi: MEMORY_GAME_CONTRACT.abi,
      functionName: 'levelUp',
    });
  };

  const { data: playerData } = useReadContract({
    address: MEMORY_GAME_CONTRACT.address,
    abi: MEMORY_GAME_CONTRACT.abi,
    functionName: 'getCurrentPlayer',
    account: userAddress,
    enabled: !!userAddress,
  });

  const { data: playerExists } = useReadContract({
    address: MEMORY_GAME_CONTRACT.address,
    abi: MEMORY_GAME_CONTRACT.abi,
    functionName: 'players',
    args: [userAddress],
    enabled: !!userAddress,
  });

  const { data: leaderboard } = useReadContract({
    address: MEMORY_GAME_CONTRACT.address,
    abi: MEMORY_GAME_CONTRACT.abi,
    functionName: 'getLeaderboard',
    args: [BigInt(10)],
  });

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = 
    useWaitForTransactionReceipt({
      hash: writeHash,
    });

  return {
    // Write functions
    registerPlayer,
    updateProgress,
    levelUp,
    
    // Read data
    playerData: playerData ? {
      level: Number(playerData[0]),
      score: Number(playerData[1]),
      bestScore: Number(playerData[2]),
      lastPlayedAt: Number(playerData[3])
    } : null,
    
    isPlayerRegistered: playerExists ? playerExists[3] : false,
    leaderboard,
    
    // Transaction states
    isWritePending,
    writeError,
    isTransactionLoading,
    isTransactionSuccess,
    transactionHash: writeHash,
    
    // Utilities
    isConnected: !!userAddress,
    userAddress,
  };
}