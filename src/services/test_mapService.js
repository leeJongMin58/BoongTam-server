export const fetchNearbyStores = async (lat, lng, lat_lu, lng_lu, lat_ru, lng_ru) => {
    // 예제: 현재는 하드코딩된 샘플 데이터를 반환
    return [
        {
            store_id: 1,
            store_name: "붕어빵 매장 A",
            address: "서울특별시 강남구 역삼동 123-4",
            latitude: 37.501123,
            longitude: 127.034567,
            heart_count: 22,
        },
        {
            store_id: 2,
            store_name: "붕어빵 매장 B",
            address: "서울특별시 강남구 역삼동 234-5",
            latitude: 37.502345,
            longitude: 127.035678,
            heart_count: 15,
        },
        // 추가 샘플 데이터                                                   
    ];
};
