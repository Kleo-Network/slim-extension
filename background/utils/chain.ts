import { polygon} from 'viem/chains';
import { createSmartAccountClient } from 'permissionless';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { createPublicClient,createWalletClient, http, type Address, type Hex, encodeFunctionData, Abi, defineChain } from 'viem';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { privateKeyToAccount } from 'viem/accounts';
import { entryPoint07Address } from 'viem/account-abstraction';

export const vana = defineChain({
    id: 14800,
    name: 'Vana Moksha Testnet',
    network: 'vana',
    nativeCurrency: {
      name: 'VANA',
      symbol: 'VANA',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://rpc.moksha.vana.org'] },
      public: { http: ['https://rpc.moksha.vana.org'] },
    },
    blockExplorers: {
      default: { name: 'VanaScan', url: 'https://moksha.vanascan.io' },
    },
  });

export type ContractData = {
  address: Address;
  abi: Abi;
  functionName: string;
  functionParams: any[];
};

export type ChainData = {
  name: string;
  rpc: string;
  contractData: ContractData;
};

export async function executeChainTransaction(chain: ChainData, privateKey: string) {
  switch (chain.name.toLowerCase()) {
    case 'polygon':
      return await executePolygonTransaction(chain, privateKey);
    case 'vana':
      return await executeVanaTransaction(chain, privateKey);
    default:
      throw new Error(`Unsupported chain: ${chain.name}`);
  }
}

async function executePolygonTransaction(chain: ChainData, privateKey: string) {

  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(chain.rpc || 'https://rpc.ankr.com/polygon'),
  });
  const paymasterUrl = `https://pim.kleo.network/api/paymaster?chainId=137`;
  const paymasterClient = createPimlicoClient({
    transport: http(paymasterUrl),
    entryPoint: {
      address: entryPoint07Address as Address,
      version: '0.7',
    },
  });
  const pimlicoUrl = `https://api.pimlico.io/v2/137/rpc?apikey=pim_7QGLikaWQjRHnVak4CLmt4`;
  const pimlicoClient = createPimlicoClient({
    transport: http(pimlicoUrl),
    entryPoint: {
      address: entryPoint07Address as Address,
      version: '0.7', 
    },
  });

  const account = await toSafeSmartAccount({
    client: publicClient,
    owners: [privateKeyToAccount(privateKey as Hex)],
    entryPoint: {
      address: entryPoint07Address as Address,
      version: '0.7',
    },
    version: '1.4.1',
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: polygon,
    bundlerTransport: http(pimlicoUrl),
    paymaster: paymasterClient,
    paymasterContext:{
        sponsorshipPolicyId: "sp_safe_gas_station_polygon"
    },
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await pimlicoClient.getUserOperationGasPrice()).fast;
      },
    },
  });

  const { contractData } = chain;
  const { address, abi, functionName, functionParams } = contractData;

  // Encode the function call data
  const data = encodeFunctionData({
    abi,
    functionName,
    args: functionParams,
  });

  // Send the transaction
  const txHash = await smartAccountClient.sendTransaction({
    to: address,
    data,
  });
  console.log('transaction hash', txHash);
  return txHash;
}

async function executeVanaTransaction(chain: ChainData, privateKey: string) {
  const { rpc, contractData } = chain;
  const { address, abi, functionName, functionParams } = contractData;
  const account = privateKeyToAccount(privateKey as Hex);

  const walletClient = createWalletClient({
    account,
    transport: http(rpc),
  });


  // Encode the function call data
  const data = encodeFunctionData({
    abi,
    functionName,
    args: functionParams,
  }) as Hex;

  // Send the transaction
  const txHash = await walletClient.sendTransaction({
      to: address as Address,
      data,
      chain: vana
  });

  return txHash;
}
