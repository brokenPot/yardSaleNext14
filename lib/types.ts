import { MouseEventHandler } from 'react';


export type ButtonProps = {
    children: React.ReactNode | string;
    icon?: React.ReactNode;
    type?: 'button' | 'reset' | 'submit';
    href?: string;
    isLoading?: boolean;
    method?: 'post' | 'delete';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    rounded?: boolean;
    outlined?: boolean;
    fullWidth?: boolean;
};