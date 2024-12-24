import axios from "axios";
  
// 택배 배송 조회 서비스 
const getTrackingInfo = async (trackingNumber) => {
  try {
    const response = await axios.get(
      "https://info.sweettracker.co.kr/api/v1/trackingInfo",
      {
        params: {
          t_code: "04", // 택배사 코드 (한진택배)
          t_invoice: trackingNumber, // 운송장 번호
          t_key: "u9WJCt0EeC693EU2a2tOxQ", // 발급받은 API 키
        },
      }
    );
    return response.data; // 스마트택배 API에서 받은 응답
  } catch (error) {
    throw new Error("배송 조회에 실패했습니다.");
  }
};

export { getTrackingInfo };