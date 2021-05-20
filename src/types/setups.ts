export type ButtonFunctionData = {
    type: 'custom' | 'router-link' | 'link-go-out' | 'link-current-page';
    url?: string;
    function?: Function;
}