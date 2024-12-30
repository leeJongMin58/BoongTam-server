import { fetchNearbyStores } from '../services/boongService.js';
import { getStoreDetails, getStoreMenu, getStorePhotos, getStoreReviews } from '../models/storeModel.js';

export const getNearbyStores = async (req, res) => {
    // 쿼리 파라미터 추출
    const { lat, lng, lat_lu, lng_lu, lat_rd, lng_rd } = req.query;

    // 파라미터가 모두 있는지 확인하고, 숫자로 변환
    if (
        !lat || !lng || !lat_lu || !lng_lu || !lat_rd || !lng_rd ||
        isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)) ||
        isNaN(parseFloat(lat_lu)) || isNaN(parseFloat(lng_lu)) ||
        isNaN(parseFloat(lat_rd)) || isNaN(parseFloat(lng_rd))
    ) {
        return res.status(400).json({
            code: 400,
            message: "잘못된 요청입니다. 모든 좌표를 올바른 형식으로 입력해주세요.",
        });
    }

    try {
        // fetchNearbyStores 호출 시, 파라미터를 올바르게 전달
        const stores = await fetchNearbyStores(
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(lat_lu),
            parseFloat(lng_lu),
            parseFloat(lat_rd),
            parseFloat(lng_rd)
        );

        const latParsed = parseFloat(lat);
        const lngParsed = parseFloat(lng);
        const latLuParsed = parseFloat(lat_lu);
        const lngLuParsed = parseFloat(lng_lu);
        const latRdParsed = parseFloat(lat_rd);
        const lngRdParsed = parseFloat(lng_rd);
        
        console.log("쿼리 범위:", lat_lu, lng_lu, lat_rd, lng_rd);
        console.log('stores:', stores);  // stores 내용 출력

        if (isNaN(latParsed) || isNaN(lngParsed) || isNaN(latLuParsed) || isNaN(lngLuParsed) || isNaN(latRdParsed) || isNaN(lngRdParsed)) {
            console.log("잘못된 숫자 값이 있습니다.");
            return res.status(400).json({
                code: 400,
                message: "잘못된 좌표 값이 전달되었습니다.",
            });
        }

        // 성공적인 응답 반환
        res.status(200).json({
            code: 200,
            msg: "통신 성공",
            count: stores[0].length,
            data: stores[0],
        });
    } catch (error) {
        console.error("컨트롤러 오류:", error);
        res.status(500).json({
            code: 500,
            message: "서버 오류가 발생했습니다.",
        });
    }
};

export const getStoreInfo = async (req, res) => {
    const { storeid, tab = 'detail', sort, filter } = req.query;

    // storeid가 없는 경우 처리
    if (!storeid) {
        return res.status(400).json({
            code: 400,
            message: "storeid는 필수입니다.",
        });
    }

    try {
        let data;

        // 각 tab에 대한 처리
        switch (tab) {
            case 'detail':
                data = await getStoreDetails(storeid);
                break;
            case 'menu':
                data = await getStoreMenu(storeid);
                break;
            case 'photo':
                data = await getStorePhotos(storeid, filter);
                break;
            case 'reviews':
                data = await getStoreReviews(storeid, sort);
                break;
            default:
                return res.status(400).json({
                    code: 400,
                    message: "잘못된 tab 값입니다.",
                });
        }

        // 응답 반환
        res.status(200).json({
            code: 200,
            message: "성공",
            data: data[0],
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `서버 오류: ${error.message}`,
        });
    }
};
