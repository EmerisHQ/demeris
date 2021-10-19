export type ButtonFunctionData = {
  type: 'custom' | 'router-link' | 'link-go-out' | 'link-current-page';
  url?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  function?: Function;
  isOver?: boolean;
};
