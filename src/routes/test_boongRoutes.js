import { Router } from "express";
import { getBoongList } from "../controllers/test_boongController.js";
import { registerUser } from "../controllers/test_boongController.js";
import axios from "axios";
const router = Router();

// GET /boongs - 붕어빵 리스트 가져오기

router.get('/boongs', getBoongList);

router.get("/boongs", getBoongList);


// POST 요청을 /register로 보내면 사용자 정보 저장
router.post("/register", registerUser);


router.get("/post", async (req, res) => {
  const { trackingNumber } = req.query; //운송장 번호 받아오기

  if (!trackingNumber) {
    return res.status(400).send("송장 번호가 없습니다");
  }
  try {
    // 스마트택배 API 호출
    const response = await axios.get(
      "https://info.sweettracker.co.kr/api/v1/trackingInfo",
      {
        params: {
          t_code: "04", // 택배사 코드 한진택배였나
          t_invoice: trackingNumber, // 운송장 번호
          t_key: "u9WJCt0EeC693EU2a2tOxQ", // 발급받은 키
        },
      }
    );

    // 스마트택배 API에서 받은 응답을 클라이언트에게 전달
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("API 호출 오류:", error);
    res.status(500).send("배송 조회에 실패했습니다.");
  }
});


export default router;
