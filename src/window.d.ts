declare global {
  interface Window {
    token: string;
    opera: any;
    gatewallet: {
      solana: any;
    };
  }
}
