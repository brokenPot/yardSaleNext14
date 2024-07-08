import { MouseEventHandler } from 'react';


export type ButtonProps = {
    icon?: React.ReactNode;
    type?: 'button' | 'reset' | 'submit';
    href?: string;
    isLoading?: boolean;
    method?: 'post' | 'delete';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    fullWidth?: boolean;
    text?:string;
};