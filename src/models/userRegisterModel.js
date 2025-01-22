// models/userModel.js
import { getDB } from '../database/connection.js';

// 회원가입 처리 - 선택 입력 및 검증
export const registerUserInDB = async (phone, id, password, address_1, address_2, zipcode, email) => {
  const query = `
      INSERT INTO users (phone_number, user_id, nickname, password, address_1, address_2, zipcode, email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const connection = await getDB();

  try {
      // 선택 사항인 값들은 없으면 NULL로 설정
      const values = [
          phone, 
          id, 
          id,
          password, 
          address_1 || null,  // address_1이 없으면 null
          address_2 || null,  // address_2가 없으면 null
          zipcode || null, // 도로명 주소 조건 추가
          email || null       // email이 없으면 null
      ];

      await connection.execute(query, values);
      return { success: true };
  } catch (error) {
      console.error('회원가입 실패:', error);
      console.log('회원가입 실패 로그:', error.code);
      // 제약 조건에 따른 오류 메시지 반환
      if (error.code === 'ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE') {
          if (error.sqlMessage.includes('users_chk_user_id')) {
              return { error: '사용자 ID는 3~20자의 영문 대소문자 및 숫자만 포함할 수 있습니다.' };
          }
          if (error.sqlMessage.includes('users_chk_password')) {
              return { error: '비밀번호는 8자 이상 20자 이하이어야 합니다.' };
          }
          /*이거는 나중에 사용 가능 (nickname검증)
          if (error.sqlMessage.includes('users_chk_1')) {
              return { error: '닉네임은 4자 이상 10자 이하이어야 합니다.' };
          }*/
          if (error.sqlMessage.includes('users_chk_2')) {
              return { error: '이메일 형식이 잘못되었습니다.' };
          }
      }

      // 중복된 사용자 ID나 전화번호
      if (error.code === 'ER_DUP_ENTRY') {
          return { error: '이미 등록된 사용자입니다.' };
      }

      // NULL 값이 허용되지 않는 필드에 NULL을 삽입하려는 경우
      if (error.code === 'ER_BAD_NULL_ERROR') {
          return { error: '필수 정보가 누락되었습니다.' };
      }

      // 데이터가 필드 크기를 초과한 경우
      if (error.code === 'ER_DATA_TOO_LONG') {
          return { error: '입력한 데이터가 너무 깁니다.' };
      }

      // SQL 구문 오류
      if (error.code === 'ER_PARSE_ERROR') {
          return { error: '회원가입 처리 중 오류가 발생했습니다.' };
      }

      // 기타 예외 처리
      console.log("에러코드: ", error.code )
      return { error: '회원가입 실패, 관리자에게 문의하세요.' };
  }
};

// 로그인 검증
export const findUserInDB = async (id) => {
  const query = 'SELECT * FROM users WHERE user_id = ?';
  const connection = await getDB();

  try {
      const [rows] = await connection.execute(query, [id]);
      return rows[0] || null; // 사용자 정보 반환, 없으면 null 반환
  } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
  }
};

// ID 중복 체크
export const checkUserIdInDB = async (id) => {
  const query = 'SELECT * FROM users WHERE user_id = ?';
  const connection = await getDB();

  try {
      const [rows] = await connection.execute(query, [id]);
      return rows[0] || null; // 사용자 정보가 존재하면 반환, 없으면 null 반환
  } catch (error) {
      console.error('ID 중복 체크 실패:', error);
      throw error;
  }
};

// 아이디 찾기
export const findUserIdbyPhone = async (phone) => {
  const query = 'SELECT user_id FROM users WHERE phone_number = ?';
  const connection = await getDB();
    
        
  try {
      const [rows] = await connection.execute(query, [phone]);
      return rows[0] || null; // 해당하는 아이디가 있으면 반환, 없으면 null 반환
  } catch (error) {
      console.error('아이디 찾기 실패:', error);
      throw error;
  }
};

export const findPassword = async (id) => {
  const query = 'SELECT password FROM users WHERE user_id = ?';
  const connection = await getDB();

  try {
      const [rows] = await connection.execute(query, [id]);
      return rows[0] || null; // 해당하는 아이디가 있으면 이메일과 비밀번호를 반환
  } catch (error) {
      console.error('비밀번호 찾기 실패:', error);
      throw error;
  }
};