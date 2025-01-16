'use client';

import { useEffect, useState } from "react";

const Sample = () => {
    const [scriptLoad, setScriptLoad] = useState<boolean>(false);
    const [map, setMap] = useState<any>(null);

    useEffect(() => {
        // 스크립트 동적 로드
        const script: HTMLScriptElement = document.createElement("script");
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services,clusterer`;
        document.head.appendChild(script);

        script.onload = () => {
            // 스크립트 로드 완료 시 초기화
            kakao.maps.load(() => {
                setScriptLoad(true);
            });
        };

        return () => {
            // 컴포넌트 언마운트 시 스크립트 제거
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (scriptLoad && !map) {
            // 지도 초기화
            const container = document.getElementById("map"); // 지도 컨테이너
            if (container) {
                const options = {
                    center: new kakao.maps.LatLng(33.5563, 126.79581), // 중심 좌표
                    level: 3, // 지도 확대 레벨
                };
                const mapInstance = new kakao.maps.Map(container, options); // 지도 생성
                new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(33.55635, 126.795841), // 마커 위치
                    map: mapInstance,
                });
                setMap(mapInstance);
            }

        }
    }, [scriptLoad, map]);

    return (
        <div>
            {scriptLoad ? (
                <div id="map" style={{ width: "100%", height: "360px" }}></div>
            ) : (
                <div>Loading map...</div>
            )}
        </div>
    );
};

export default Sample;
