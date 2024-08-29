// import getSession from "@/lib/session";
import EditProfileComp from "@/app/(tabs)/profile/edit/EditProfileComp";
import {getUser} from "@/app/(tabs)/profile/actions";
import KakaoMap from "@/app/(tabs)/profile/KakaoMap";
import React from "react";


export default async function  EditProfile ({
                                                params,
                                            }: {
    params: { id: string };
})  {
    const userData =  await getUser()

    return (
        <div>
            <EditProfileComp userId={userData.id}
                             avatar={userData.avatar}
                             name={userData.name}
                             phone={userData.phone!}
                             email={userData.email!}
            />
            <KakaoMap roadAddress={userData.roadAddress} latitude={userData.lat} longitude={userData.lng} />
        </div>
    );
};

