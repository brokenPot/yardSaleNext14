"use client";

import {useForm} from "react-hook-form";
import _Input from "@/components/input";
import ProductAddBtn from "@/components/productAddBtn";
import {userSchema, UserType} from "@/app/(tabs)/profile/edit/schema";
import {editUser} from "@/app/(tabs)/profile/edit/actions";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import Image from "next/image";

interface UserDataType {
    userId: number;
    avatar?: any;
    name: string;
    phone?: string;
    email?: string;
}


export default  function  EditProfileComp ({userId,avatar, name,phone,email}:UserDataType)  {
    const [preview, setPreview] = useState(avatar);
    const {
        register,
        setValue,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UserType>({
        resolver: zodResolver(userSchema),
    });

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) return;
        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);
        setValue(
            "avatar",
            file
        );
    };

    const onSubmitData = handleSubmit(async (data: UserType) => {
        const formData = new FormData();
        formData.append("userId",  userId as any);
        formData.append("avatar", data.avatar as any);
        formData.append("name", data.name as any);
        formData.append("phone",   data.phone as any);
        formData.append("email", data.email as any);
        const errors = await editUser(formData);
        if (errors) {
            console.log(errors);
        }
    });
    const onValid = async () => {
        await onSubmitData();
    };
    return (
        <div >
            <form action={onValid} className="py-10 px-4 space-y-4">
                <div className="flex items-center space-x-3">
                    {preview ?
                        (<Image
                            width={100}
                            height={100}
                            src={ preview}
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
                            onChange={onImageChange}
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
                </div>
                <_Input
                    required
                    type="text"
                    placeholder={name}
                    {...register("name")}
                    errors={[errors.name?.message ?? ""]}
                />
                <_Input
                    required
                    type="email"
                    placeholder={email}
                    {...register("email")}
                    errors={[errors.email?.message ?? ""]}
                />
                <_Input
                    required
                    type="number"
                    placeholder={phone}
                    {...register("phone")}
                    errors={[errors.phone?.message ?? ""]}
                />
                <ProductAddBtn type="submit" text={'작성완료'}/>
            </form>
        </div>
    );
};

