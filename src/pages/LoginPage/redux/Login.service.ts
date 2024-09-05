import { SolanaWallet } from '@web3auth/solana-provider';
import bs58 from 'bs58';

export const apiRequestNonce = async (publicAddress: string, invitedBy: string) => {
  const data = {
    publicAddress: publicAddress,
    invitedBy: invitedBy,
  };
  const apiURL = `https://dev-api.manekopet.xyz/nonce`;
  const parameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return fetch(apiURL, parameters)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json;
    });
};

export const apiGetSignature = async (publicAddress: string, nonce: string, web3authProvider: any) => {
  const solanaWallet = new SolanaWallet(web3authProvider);
  const msg = Buffer.from(`${nonce}`, 'utf8');
  const res = await solanaWallet.signMessage(msg);
  const bytes = Uint8Array.from(res);
  const messageSignedBase58 = bs58.encode(bytes);
  return messageSignedBase58;
};

export const apiGetAccessToken = async (
  publicAddress: string,
  invitedBy: string,
  signedString: string,
  nonce: string,
) => {
  const data = {
    publicAddress: publicAddress,
    signedString: signedString,
    nonce: nonce,
    invitedBy: invitedBy,
  };
  const apiURL = `https://dev-api.manekopet.xyz/auth`;
  const parameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  return fetch(apiURL, parameters)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json;
    });
};
