const ethers = require('ethers');
const namehash = require('eth-ens-namehash');


const ensAbi = [{
  constant: true,
  inputs: [
    {
      internalType: 'bytes32',
      name: 'node',
      type: 'bytes32',
    },
    {
      internalType: 'string',
      name: 'key',
      type: 'string',
    },
  ],
  name: 'text',
  outputs: [
    {
      internalType: 'string',
      name: '',
      type: 'string',
    },
  ],
  payable: false,
  stateMutability: 'view',
  type: 'function',
}];

const provider = ethers.getDefaultProvider();

const ensPublicResolver = '0xdaaf96c344f63131acadd0ea35170e7892d3dfba';

const contract = new ethers.Contract(ensPublicResolver, ensAbi, provider);

const getBuyerInfo = async (userAddress) => {
  const name = await provider.lookupAddress(userAddress);

  if (name !== null) {
    const res = await contract.text(namehash.hash(name), 'description');
    return (JSON.parse(res));
  }

  throw new Error('Unable to find user on ENS');
};

module.exports = {
  getBuyerInfo,
};
