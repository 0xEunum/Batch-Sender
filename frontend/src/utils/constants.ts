import { Abi } from 'viem'
import { ERC20BatchSenderAbi } from './abi/ERC20BatchSenderAbi'

export const CONTRACTS: Record<number, { ERC20BatchSender: `0x${string}`, ERC20BatchSenderAbi: Abi }> = {
  1: {
    ERC20BatchSender: '0xYourMainnetAddress',
    ERC20BatchSenderAbi: ERC20BatchSenderAbi,
  },
  11155111: {
    ERC20BatchSender: '0xd426a477594ddD6380A421B4E9DA410e17895b4B',
    ERC20BatchSenderAbi: ERC20BatchSenderAbi,
  },
  421614: {
    ERC20BatchSender: '0xYourArbSepoliaAddress',
    ERC20BatchSenderAbi: ERC20BatchSenderAbi,
  },
  31337: {
    ERC20BatchSender: '0xYourAnvilAddress',
    ERC20BatchSenderAbi: ERC20BatchSenderAbi,
  },
}

export function getContractConfig(chainId: number) {
  const config = CONTRACTS[chainId]
  if (!config) {
    throw new Error(`No contract config for chainId ${chainId}`)
  }
  return config
}
