export type LoadingState = {
  isLoading?: boolean;
};

export type FetchingState = {
  isFetching?: boolean;
};

export interface MenuItem {
  name: string;
  image: string;
  href: string;
}
