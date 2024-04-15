"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
    text: string;
}

export default function FormButton({  text }: FormButtonProps) {
    const { pending } = useFormStatus(); // form의 자식에서만 사용할 수 있다.
    return (
        <button
            disabled={pending}
            className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            {pending ? "Loading..." : text}
        </button>
    );
}