"use client";

import React, { useEffect, useState } from 'react';
import {setUserAddress} from "@/app/(tabs)/profile/actions";
import { Map } from "react-kakao-maps-sdk";
import {KakaoKeywordMapProps} from "@/app/(tabs)/profile/comps/KakaoKeywordMap";
declare let kakao: any;

const KakaoMap = ({roadAddress  ,latitude   ,longitude  }:KakaoKeywordMapProps) => {
    const [map, setMap] = useState<any>();
    const [marker, setMarker] = useState<any>();
    const [keyWord,setKeyWord ] = useState<string>("");
    const [selectedRoadAddress, setSelectedRoadAddress]= useState<string | null>(roadAddress);
    const [scriptLoad, setScriptLoad] = useState<boolean>(false);
    const [lat, setLat] = useState<string | null>(latitude)
    const [lng, setLng] = useState<string | null>(longitude)

    useEffect(() => {
        const loadKakaoMapScript = () => {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services,clusterer`;
            script.async = true;
            script.onload = initKakaoMap;
            script.addEventListener("load", () => {
                setScriptLoad(true);
            })
            document.head.appendChild(script);
        };
        const initKakaoMap = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setupMap, handleError,{
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000,
                });
            }
        };
        const setupMap = ({ coords: { latitude, longitude }}: GeolocationPosition) => {
            new kakao.maps.load(() => {
                const container = document.getElementById('map');
                if (container) {
                    const options = {
                        center: new kakao.maps.LatLng(lat ? lat : latitude+0.01, lng ? lng : longitude-0.006),
                        level: 3,
                    };
                    const newMap = new kakao.maps.Map(container, options);
                    setMap(newMap);
                    const newMarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(lat  ? lat : latitude+0.01, lng ? lng : longitude-0.006),
                        map: newMap,
                    });
                    setMarker(newMarker);
                }
            });
        };
        const handleError = (error: GeolocationPositionError) => {
            console.error('Geolocation error:', error);
        };
        loadKakaoMapScript();
    }, [lat,lng]);

    const updateCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(
            updatePositionOnMap,
            () => alert("위치 정보를 가져오는데 실패했습니다."),
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000,
            }
        );
    }

    const saveSelectedPosition = async () => {
         const roadAddress = await setUserAddress({roadAddress : selectedRoadAddress,placeName:"",latitude: lat,longitude: lng});
         window.alert(roadAddress + "주소 업데이트")
    }

    const updatePositionOnMap = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
        const currentPos = new kakao.maps.LatLng(latitude+0.01, longitude-0.006);
        if (map && marker) {
            map.panTo(currentPos);
            marker.setPosition(currentPos);
        }
    };

    function keywordSearch( ) {
        const ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성합니다
        ps.keywordSearch(keyWord, placesSearchCB);
    }

    function placesSearchCB(data:any, status:any) {
        console.log(data)
        console.log(status)
        if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds(); // 지도 범위를 재설정하기 위해 LatLngBounds 객체에 좌표를 추가합니다
            data.forEach((place:any) => {
                displayMarker(place);
                bounds.extend(new kakao.maps.LatLng(place.y, place.x));
            });
            map.setBounds(bounds); // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        }
    }
    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(place:any) {
        const newMarker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x)
        });
        kakao.maps.event.addListener(newMarker, 'click', () => {
            setSelectedRoadAddress(place.road_address_name)
            setLat(place.y) // y 위도 latitude
            setLng(place.x) // x 경도 longitude
            window.alert(place.road_address_name + "주소 저장 버튼 누를 시 저장 주소 변경 및 추가")
            const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:5px; font-size:12px; color:black">${place.place_name}</div>`,
            });
            infowindow.open(map, newMarker);
        });
    }
        return (
            <div className="px-4 space-y-4">
                <div className="flex justify-evenly items-center">
                    <input
                        type="text"
                        placeholder="키워드"
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        className="border rounded-md p-2 mr-2 text-black w-[60%]"
                    />
                    <button
                        onClick={keywordSearch}
                        className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold w-[25%]"
                    >
                        키워드 검색
                    </button>
                </div>
                {scriptLoad ?
                    <Map
                        id="map"
                        center={{ lat: 33.5563, lng: 126.79581 }}
                        className="w-[100%] h-72"
                        // style={{ width: '800px', height: '600px' }}
                        level={3}>
                    </Map>
                    :
                    <div></div>
                }
                {/*<div id="map" className="w-[100%] h-72"/>*/}
                <div className="flex justify-evenly items-center">
                    <div className="flex items-center mt-5">
                        {roadAddress}
                    </div>
                    <button
                        onClick={updateCurrentPosition}
                        className="mt-5 bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    >
                        현재 위치
                    </button>
                    <button
                        onClick={saveSelectedPosition}
                        className="ml-5 mt-5 bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    >
                        주소 저장
                    </button>
                </div>
            </div>
        );
};

export default KakaoMap;
