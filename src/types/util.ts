export type Subscribable<T> = {
  subscribe: boolean;
} & T;
export type ActionParams<A> = {
  params: A;
};
export type SimpleSubscribable = Pick<Subscribable<unknown>, 'subscribe'>;

export type APIPromise = {
  hash: string;
  promise: Promise<void>;
};

export enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  LOADED = 'LOADED',
}
export type ChartPrices = Array<{ x: string; y: number }>;
export type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

export type DesignSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ModalVariant = 'dialog' | 'center' | 'takeover' | 'bottom' | 'full';
