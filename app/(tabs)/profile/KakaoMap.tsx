"use client";

import React, { useEffect, useState } from 'react';
declare let kakao: any;

const KakaoMap = () => {
    const [map, setMap] = useState<any>();
    const [marker, setMarker] = useState<any>();
    const [latitudes, setLatitude] = useState<string | null>(null);
    const [longitudes, setLongitude] = useState<string | null>(null);

    useEffect(() => {
        const loadKakaoMapScript = () => {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services,clusterer`;
            script.async = true;
            script.onload = initKakaoMap;
            document.head.appendChild(script);
        };

        const initKakaoMap = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
            }
        };

        const handleSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude.toString());
            setLongitude(longitude.toString());

            new kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(latitude, longitude),
                    level: 3,
                };
                setMap(new kakao.maps.Map(container, options));
                setMarker(new kakao.maps.Marker());

                if (container && latitude && longitude) {

                    new kakao.maps.Map(container, options);
                }
            });
        };


        const handleError = (error: GeolocationPositionError) => {
            console.error('Geolocation error:', error);
        };

        loadKakaoMapScript();
    }, [latitudes, longitudes]);


    const getCurrentPosBtn = () => {
        console.log('!')
        navigator.geolocation.getCurrentPosition(
            getPosSuccess,
            () => alert("위치 정보를 가져오는데 실패했습니다."),
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000,
            }
        );
    }
    const getPosSuccess = (pos: GeolocationPosition) => {
        // 현재 위치(위도, 경도) 가져온다.
        var currentPos = new kakao.maps.LatLng(
            pos.coords.latitude, // 위도
            pos.coords.longitude // 경도
        );
        console.log(currentPos)
        setLatitude(currentPos.La.toString());
        setLongitude(currentPos.Ma.toString());
        // 지도를 이동 시킨다.
        // map.panTo(currentPos);
        //
        // // 기존 마커를 제거하고 새로운 마커를 넣는다.
        // marker.setMap(null);
        // marker.setPosition(currentPos);
        // marker.setMap(map);
    };
    // Number(latitudes)
    // Number(latitudes+"5")
    //
    // Number(longitudes)
    // Number(longitudes+"4")
        return (
            <div>
                {/*<Map*/}
                {/*    center={{ lat: 33.5563, lng: 126.79581 }}*/}
                {/*    style={{ width: "100%", height: "360px" }}*/}
                {/*>*/}
                {/*    <MapMarker position={{lat: 33.55635, lng: 126.795841}}>*/}
                {/*        <div*/}
                {/*            style={{*/}
                {/*                color: '#9971ff',*/}
                {/*                fontSize: '19px',*/}
                {/*                fontWeight: '700',*/}
                {/*                border: '4px solid #9971ff',*/}
                {/*                borderRadius: '10px',*/}
                {/*                padding: '2.5px',*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            🎬 small box 🎬*/}
                {/*        </div>*/}
                {/*    </MapMarker>*/}
                {/*</Map>*/}

                <div className="flex items-center justify-center pt-2">

                <div id="map" className="w-[95%] h-72"/>
                <button onClick={()=>{getCurrentPosBtn()}} className="mt-5 bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold">
                    현재 위치
                </button>


                </div>
            </div>
        );
};

export default KakaoMap;
