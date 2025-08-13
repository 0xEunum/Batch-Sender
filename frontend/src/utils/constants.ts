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
  300: {
    ERC20BatchSender: "0x33fcC44E4e47CAC3934ae9dF8013984033c1Dd00",
    ERC20BatchSenderAbi: ERC20BatchSenderAbi,
  },
  11155420: {
    ERC20BatchSender: "0x430973f9F475470A95d84144B50671b5E169de00",
    ERC20BatchSenderAbi: ERC20BatchSenderAbi,
  },
  421614: {
    ERC20BatchSender: '0xf60eff56861232F6A50dC545c07ab76898ef49b5',
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
