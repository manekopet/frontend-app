export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export enum LocalStorageKey {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  AA_SESSION_ID = 'aaSessionID',
  AA_LAST_ACTIVE = 'aaSessionLastActive',
  USER_ID = 'userId',
  USER_DISPLAYNAME = 'userDisplayName',
  USER_AVATAR = 'userAvatar',
  USER_PSEUDO_ID = 'userPseudoId',
  USER_WALLET_ADDRESS = 'userWalletAddress',
  USER_LOCATION = 'userLocation',
  SESSION_FIRST_PAGE_VIEW = 'sessionFirstPageView',
  FLAG_SIGN = 'flagSign',
}
