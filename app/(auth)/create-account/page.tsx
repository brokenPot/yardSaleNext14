"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import FormButton from "@/components/form-btn";
import {useState} from "react";
import Image from "next/image";

export default function CreateAccount() {
    const [preview, setPreview] = useState<string>('');
    const [state, dispatch] = useFormState(createAccount, null);
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) return;
        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <div className="flex items-center space-x-3">
                    {preview ?
                        (<Image
                            width={100}
                            height={100}
                            src={preview}
                            alt={preview}
                            priority
                        />)
                        : (
                            <div className="w-14 h-14 rounded-full bg-slate-500"/>
                        )}
                    <label
                        htmlFor="picture"
                        className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-white hover:text-gray-700"
                    >
                        Change
                        <input
                            name='avatar'
                            onChange={onImageChange}
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
                </div>
                <Input
                    name="name"
                    type="text"
                    placeholder="Username"
                    required
                    errors={state?.fieldErrors.name}
                    minLength={3}
                    maxLength={10}
                />
                <Input name="email" type="email" placeholder="Email" required errors={state?.fieldErrors.email}/>
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.fieldErrors.password}
                    minLength={PASSWORD_MIN_LENGTH}
                />
                <Input
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    errors={state?.fieldErrors.confirm_password}
                    minLength={PASSWORD_MIN_LENGTH}
                />
                <FormButton text={'Create account'}/>
            </form>
            <SocialLogin/>
        </div>
    );
}

