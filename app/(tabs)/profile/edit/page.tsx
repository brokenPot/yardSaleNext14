import EditProfileComp from "@/app/(tabs)/profile/edit/EditProfileComp";
import {getUser} from "@/app/(tabs)/profile/actions";
import React from "react";
import KakaoKeywordMap from "@/app/(tabs)/profile/comps/KakaoKeywordMap";


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
            <KakaoKeywordMap roadAddress={userData.roadAddress} placeName={userData.placeName} latitude={userData.lat} longitude={userData.lng}/>
        </div>
    );
};

