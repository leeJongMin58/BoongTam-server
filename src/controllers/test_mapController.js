import { fetchNearbyStores } from '../services/test_mapService.js';

export const getNearbyStores = async (req, res) => {
    const { lat, lng, lat_lu, lng_lu, lat_ru, lng_ru } = req.query;

    // 유효성 검사
    if (!lat || !lng || !lat_lu || !lng_lu || !lat_ru || !lng_ru) {
        return res.status(400).json({
            code: 400,
            message: "요청에 잘못된 파라미터가 포함되어 있습니다.",
        });
    }

    try {
        const stores = await fetchNearbyStores(lat, lng, lat_lu, lng_lu, lat_ru, lng_ru);
        res.status(200).json({
            code: 200,
            msg: "통신 성공",
            count: stores.length,
            nextPage: false, // 예제에선 페이징이 없으므로 false
            data: stores,
        });
    } catch (error) {
        console.error("지도 검색 API 오류:", error);
        res.status(500).json({
            code: 500,
            message: "서버 오류가 발생했습니다.",
        });
    }
};
