"use client";

import React, { useState, useEffect } from 'react';
import { Map, MapMarker, useMap } from 'react-kakao-maps-sdk';
import './kakaomap.css';
import {setUserAddress} from "@/app/(tabs)/profile/actions";
declare let kakao: any;

export interface KakaoKeywordMapProps {
    roadAddress :string | null ,
    placeName:string | null ,
    latitude  : string | null  ,
    longitude: string | null
}

function KakaoKeywordMap({roadAddress, placeName ,latitude   ,longitude  }:KakaoKeywordMapProps) {
    const [searchBar, setSearchbar] = useState<boolean>(true);
    const [map, setMap] = useState<any>();
    // const [marker, setMarker] = useState<any>();
    const [markers, setMarkers] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [scriptLoad, setScriptLoad] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState(roadAddress || '');
    const [keyword, setKeyword] = useState(roadAddress || '');
    // const [selectedPlace, setSelectedPlace] = useState();
    const [lat, ] = useState<number | null>(latitude !== null ? parseFloat(latitude) : null )
    const [lng, ] = useState<number | null>( longitude !== null ? parseFloat(longitude) : null )

    const markerImageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = {width: 36, height: 37};
    const spriteSize = {width: 36, height: 691};

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setKeyword(searchInput);
    };

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
                    // const newMarker = new kakao.maps.Marker({
                    //     position: new kakao.maps.LatLng(lat  ? lat : latitude+0.01, lng ? lng : longitude-0.006),
                    //     map: newMap,
                    // });
                    // setMarker(newMarker);
                }
            });
        };
        const handleError = (error: GeolocationPositionError) => {
            console.error('Geolocation error:', error);
        };
        loadKakaoMapScript();
    }, [lng, lat]);

    useEffect(() => {
        if (!map) return;
        const ps = new kakao.maps.services.Places();
        if(keyword!==''){
            ps.keywordSearch(keyword, (data:any, status:any, _pagination:any) => {
                if (status === kakao.maps.services.Status.OK) {
                    setPlaces(data);

                    /* 이하는 function displayPlaces(places) 함수와 비슷한 내용 */
                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                    // LatLngBounds 객체에 좌표를 추가합니다
                    const bounds = new kakao.maps.LatLngBounds();
                    let markers = [];

                    for (var i = 0; i < data.length; i++) {
                        // @ts-ignore
                        markers.push({
                            position: {
                                lat: data[i].y,
                                lng: data[i].x,
                            },
                            content: data[i].place_name,
                        });
                        // @ts-ignore
                        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                    }
                    setMarkers(markers);

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                    map.setBounds(bounds);
                }
            });

        }

    }, [map, keyword]);
    const EventMarkerContainer = ({ position, content, i }: any) => {
        const map = useMap();
        const [isVisible, setIsVisible] = useState(false);

        return (
            <MapMarker
                position={position}
                image={{
                    src: markerImageSrc,
                    size: imageSize,
                    options: {
                        spriteSize: spriteSize,
                        spriteOrigin: new kakao.maps.Point(0, i * 46 + 10),
                        offset: new kakao.maps.Point(13, 37),
                    },
                }}
                onClick={(marker) => {
                    map.panTo(marker.getPosition());
                    // setSelectedPlace(places[i]);
                }}
                onMouseOver={() => setIsVisible(true)}
                onMouseOut={() => setIsVisible(false)}
            >
                {isVisible && <div style={{color: '#000'}}>{content}</div>}
            </MapMarker>
        );
    }
    const saveSelectedPosition = async ({ roadAddress,placeName,latitude,longitude}:KakaoKeywordMapProps) => {
        const result = await setUserAddress({roadAddress ,placeName,  latitude,longitude});
        window.alert(result + "주소 업데이트")
    }

    return (
        <div className="map_wrap">
            <div className={"flex justify-between"}>
                <div className={''}>
                    {placeName}
                </div>
                <div>
                    {roadAddress}
                </div>
            </div>
            {scriptLoad && (
                <>
                    <Map // 로드뷰를 표시할 Container
                        center={{
                            lat: lat!,
                            lng: lng!,
                        }}
                        className="w-[100%] h-[60%] md:h-[90%]"
                        level={3}
                        onCreate={setMap}
                    >
                        {markers.map((marker, i) => (
                            <EventMarkerContainer
                                key={`EventMarkerContainer-${marker.position.lat}-${marker.position.lng}-${i}`}
                                position={marker.position}
                                content={marker.content}
                                i={i}
                            />
                        ))}
                    </Map>
                    {searchBar && (<div id="menu_wrap" className="bg-[#fff]">
                        <div className="option">
                            <div>
                                <form onSubmit={handleSearchSubmit}>
                                    키워드 :{' '}
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={handleKeywordChange}
                                        id="keyword"
                                        size={15}
                                    />
                                    <button type="submit">검색하기</button>
                                </form>
                            </div>
                        </div>
                        <hr/>
                        <ul id="placesList">
                            {places.map((item, i) => (
                                <li
                                    key={i}
                                    className="item"
                                    onClick={() => {
                                        map.panTo(
                                            new kakao.maps.LatLng(
                                                markers[i].position.lat,
                                                markers[i].position.lng
                                            )
                                        );
                                        saveSelectedPosition({
                                            roadAddress: item.road_address_name,
                                            placeName: item.place_name,
                                            latitude: item.y,
                                            longitude: item.x
                                        })
                                    }}
                                >
                                    <span className={`markerbg marker_${i + 1}`}></span>
                                    <div className="info">
                                        <h5>{item.place_name}</h5>
                                        {item.road_address_name ? (
                                            <>
                                                <span>{item.road_address_name}</span>
                                                <span className="jibun gray">{item.address_name}</span>
                                            </>
                                        ) : (
                                            <span>{item.address_name}</span>
                                        )}
                                        <span className="tel">{item.phone}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div id="pagination"></div>
                    </div>)}
                </>
            )}
            <div className={"flex justify-end"}>
                <button
                    className="w-3/12 h-8 bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-md text-white font-semibold"
                    onClick={() => {
                        setSearchbar(prevState => !prevState)
                    }}
                >{searchBar ? "검색창 닫기" :"검색창 열기"}
                </button>
            </div>
        </div>
    );
}

export default KakaoKeywordMap;