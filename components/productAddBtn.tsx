'use client';

import { useFormStatus } from 'react-dom';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import {ButtonProps} from "@/lib/types";
export default function  ProductAddBtn  ({
                    icon,
                    type = 'button',
                    href,
                    isLoading,
                    onClick,
                    method = 'post',
                    fullWidth = false,
                    text
                }: ButtonProps)  {
    const { pending } = useFormStatus();
    // 돌아가기 나중에
    return isLoading ?? pending ? (
        <ArrowPathIcon className="size-10 animate-spin mx-auto dark:text-gray-100" />
    ) : (
        <button
            type={type}
            className={`px-6 ${fullWidth ? 'w-full flex justify-center items-center' : 'w-fit'} mx-auto h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed font-semibold active:scale-90 ${method === 'delete' ? 'delete-btn' : 'primary-btn'} `}
            disabled={isLoading ?? pending}
            onClick={onClick}
        >
            {href ? (
                    <div className="flex items-center justify-between gap-2" >
                        {icon && icon}
                        {text}
                    </div>
            ) : (
                <div className="flex items-center justify-between gap-2">
                    {icon && icon}
                    {text}
                </div>
            )}
        </button>
    );
};