"use client";

import Input from "@/components/input";
import {editUser} from "@/app/(tabs)/profile/edit/actions";
import Image from "next/image";
import {useFormState} from "react-dom";
import FormButton from "@/components/form-btn";
import {useState} from "react";

interface UserDataType {
    userId: number;
    avatar?: any;
    name: string;
    phone?: string;
    email?: string;
}

export default  function  EditProfileComp ({avatar, name,phone,email}:UserDataType)  {
    const [preview, setPreview] = useState(avatar);
    const [state, dispatch] = useFormState(editUser, null);

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) return;
        const url = URL.createObjectURL(files[0]);
        setPreview(url);
    };

    return (
        <div >
            <form action={dispatch} className="py-10 px-4 space-y-4">
                <div className="flex items-center space-x-3">
                    {preview ?
                        (<Image
                            width={100}
                            height={100}
                            style={{ width: 100, height: 100 }}
                            src={preview}
                            alt={name}
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
                    {state?.fieldErrors.avatar}
                </div>
                <Input
                    required
                    type="text"
                    defaultValue={name}
                    placeholder={'이름'}
                    name="name"
                    errors={state?.fieldErrors.name}
                />
                <Input
                    type="email"
                    defaultValue={email}
                    placeholder={'이메일'}
                    name="email"
                    errors={state?.fieldErrors.email}
                />
                <Input
                    required
                    type="number"
                    defaultValue={phone}
                    placeholder={'전화번호'}
                    name="phone"
                    errors={state?.fieldErrors.phone}
                />
                <FormButton  text={'작성완료'}/>
            </form>
        </div>
    );
};

