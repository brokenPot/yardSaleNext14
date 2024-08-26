"use client";

import React, { useEffect, useState } from 'react';
declare let kakao: any;

const KakaoMap = () => {
    const [map, setMap] = useState<any>();
    const [marker, setMarker] = useState<any>();
    const [keyWord,setKeyWord ] = useState<string>("");
    const [inputLatitude, setInputLatitude] = useState<string>('');
    const [inputLongitude, setInputLongitude] = useState<string>('');

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
                navigator.geolocation.getCurrentPosition(setupMap, handleError);
            }
        };

        const setupMap = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
            new kakao.maps.load(() => {
                const container = document.getElementById('map');
                if (container) {
                    const options = {
                        center: new kakao.maps.LatLng(latitude, longitude),
                        level: 3,
                    };
                    const newMap = new kakao.maps.Map(container, options);
                    setMap(newMap);

                    const newMarker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(latitude, longitude),
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
    }, [ ]);

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
    const updatePositionOnMap = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
        const currentPos = new kakao.maps.LatLng(latitude, longitude);
        if (map && marker) {
            map.panTo(currentPos);
            marker.setPosition(currentPos);
        }
    };
    const updateMapWithInput = () => {
        const lat = parseFloat(inputLatitude);
        const lng = parseFloat(inputLongitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            const newPos = new kakao.maps.LatLng(lat, lng);

            if (map && marker) {
                map.panTo(newPos);
                marker.setPosition(newPos);
            }
        } else {
            alert("유효한 위도와 경도를 입력하세요.");
        }
    };

    function keywordSearch( ) {
        const ps = new kakao.maps.services.Places(); // 장소 검색 객체를 생성합니다
        ps.keywordSearch(keyWord, placesSearchCB);
    }

    function placesSearchCB(data:any, status:any) {
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
            const infowindow = new kakao.maps.InfoWindow({
                content: `<div style="padding:5px; font-size:12px; color:black">${place.place_name}</div>`,
            });
            infowindow.open(map, newMarker);
        });
    }
        return (
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="위도"
                        value={inputLatitude}
                        onChange={(e) => setInputLatitude(e.target.value)}
                        className="border rounded-md p-2 mr-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="경도"
                        value={inputLongitude}
                        onChange={(e) => setInputLongitude(e.target.value)}
                        className="border rounded-md p-2 mr-2 text-black"
                    />
                    <button
                        onClick={updateMapWithInput}
                        className="bg-green-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    >
                        위치 이동
                    </button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="키워드"
                        value={keyWord}
                        onChange={(e) => setKeyWord(e.target.value)}
                        className="border rounded-md p-2 mr-2 text-black"
                    />
                    <button
                        onClick={keywordSearch}
                        className="bg-green-500 px-5 py-2.5 rounded-md text-white font-semibold"
                    >
                        키워드 검색
                    </button>
                </div>
                <div id="map" className="w-[95%] h-72"/>
                <button
                    onClick={updateCurrentPosition}
                    className="mt-5 bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold"
                >
                    현재 위치
                </button>
            </div>
        );
};

export default KakaoMap;
