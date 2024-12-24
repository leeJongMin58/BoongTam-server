
//import { getTrackingInfo } from "../services/boongService.js";
import {getDB} from '../database/connection.js'

// // 배송조회 api 핸들러 추후 프론트엔드에서 쓸 수 있음 
// const getTrackingHistory = async (req, res) => {
//   const { trackingNumber } = req.query;

//   if (!trackingNumber) {
//     return res.status(400).send("송장 번호가 없습니다");
//   }

//   try {
//     const trackingInfo = await getTrackingInfo(trackingNumber);
//     res.json(trackingInfo);
//   } catch (error) {
//     console.error("API 호출 오류:", error);
//     res.status(500).send(error.message);
//   }
// };

//export { getTrackingHistory };

//사용자 정보 저장
const saveUser = async (req, res) => {
  const { id, nickname } = req.body;

  if (!id || !nickname) {
      return res.status(400).json({ message: '사용자 ID와 닉네임이 필요합니다.' });
  }

  try {
      const db = await getDB(); // DB 연결 가져오기
      const query = `
          INSERT INTO users (id, nickname)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE
          nickname = VALUES(nickname);
      `;
      console.log('쿼리 실행 전:', query, [id, nickname])
      const result = await db.execute(query, [id, nickname]);


      // 쿼리 실행 결과 확인
      console.log('DB 저장 결과:', result); // 결과 출력
      
      if (result.affectedRows > 0) {
          res.status(200).json({ message: '사용자 데이터 저장 성공!', user: { id, nickname } });
      } else {
          res.status(400).json({ message: '사용자 데이터 저장 실패 (변경된 데이터 없음)' });
      }
  } catch (error) {
      console.error('DB 저장 중 오류:', error);
      res.status(500).json({ message: '서버 오류로 인해 데이터 저장에 실패했습니다.', error: error.message });
  }
};

export {saveUser};

//메인 굿즈 조회 핸들러 
