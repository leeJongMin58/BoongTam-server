// services/smsService.js
import coolsms from 'coolsms-node-sdk';
import { config } from '../config.js';    // config 파일에서 환경 변수 가져오기
import { saveVerificationCode } from '../models/verificationModel.js';

// 인증 코드 발송 함수
export const sendTokenToSMS = async (phone) => {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const mysms = coolsms.default;
  const messageService = new mysms(config.api.apiKey, config.api.apiSecretKey);

  try {
    // 인증 코드 발송
    const result = await messageService.sendOne({
      to: phone,
      from: config.api.hpNumber,  // 환경 변수에서 발신 번호 읽기
      text: `발신자 : [BoongTam] 인증번호 입력 -> [${code}]`,
    });

    // 인증 코드 데이터베이스에 저장
    await saveVerificationCode(phone, code);

    return { message: '인증 코드가 발송되었습니다.' };
  } catch (err) {
    console.error('발송 실패:', err);
    return { error: '인증 코드 발송 실패' };
  }
};
