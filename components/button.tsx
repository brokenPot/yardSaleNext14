"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
    text: string;
}

export default function Button({ text }: ButtonProps) {
    // useFormStatus는 form action의 작업 상태를 알려주는 훅
    // useFormStatus 훅은 action을 실행하는 form과 같은 곳에서 사용이 불가하다.
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            {pending ? "로딩 중" : text}
        </button>
    );
}
