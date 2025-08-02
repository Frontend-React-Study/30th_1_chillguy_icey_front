import axios from "axios";

const BASE_URL =
  "https://icey-backend-1027532113913.asia-northeast3.run.app/api/smalltalk";

// 스몰톡 리스트 가져오기
export const getSmallTalkList = async (token) => {
  return axios.get(`${BASE_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 스몰톡 상세 조회
export const getSmallTalkDetail = async (id, token) => {
  return axios.get(`${BASE_URL}/list/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 스몰톡 삭제 (리스트 전체 삭제)
export const deleteSmallTalkList = async (listId, token) => {
  return axios.delete(`${BASE_URL}/list/${listId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 특정 스몰톡 질문 항목 삭제 (예: talkId는 smallTalks 배열 내의 개별 질문 ID)
export const deleteSmallTalkTalkItem = async (talkId, token) => {
  return axios.delete(`${BASE_URL}/talk/${talkId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 스몰톡 제목 업데이트
export const updateSmallTalkTitle = async (listId, newTitle, token) => {
  return axios.put(
    `${BASE_URL}/list/${listId}/title`,
    { newTitle },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// 스몰톡 질문 내용 편집 (개별 질문 수정)
// API 스키마에 따라 { "edits": [...] } 형태의 객체를 본문으로 받도록 수정
export const editSmallTalkQuestions = async (listId, data, token) => {
  return axios.put(
    `${BASE_URL}/list/${listId}/edit`,
    data, // data는 { edits: [...] } 형태의 객체여야 함
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// 새로운 스몰톡 저장
export const saveSmallTalk = async (data, token) => {
  return axios.post(`${BASE_URL}/save`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 스몰톡 미리보기 생성 (AI를 통한 질문 생성)
export const previewSmallTalk = async (target, purpose, token) => {
  return axios.post(
    `${BASE_URL}/preview`,
    { target, purpose },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// 사용자 정보 가져오기
export const getUserInfo = async (token) => {
  return axios.get(
    "https://icey-backend-1027532113913.asia-northeast3.run.app/api/user-info",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
