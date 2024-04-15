import {InputHTMLAttributes} from "react";

interface FormInputProps {
    name:string
    errors?: string[];
}

export default function Input({
                                      name,
                                      errors=[],
    ...rest
                                  }: FormInputProps & InputHTMLAttributes<HTMLInputElement>) { // 커스텀 인풋 프롭스와 본래 인풋 프롭스만 받도록 타입 설정
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="bg-transparent rounded-md pl-[10px] w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-blue-500 border-none placeholder:text-neutral-400"
                autoComplete={"off"}
                {...rest}
            />
            {errors.map((error, index) => (
                <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
            ))}
        </div>
    );
}