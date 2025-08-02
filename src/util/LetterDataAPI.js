import api from "./api";

// 받은 쪽지 목록 조회
export const fetchReceivedLetters = async (teamId) => {
  try {
    const res = await api.get(`/api/teams/${teamId}/letters/received`);
    return res.data?.data || [];
  } catch (error) {
    console.error("받은 쪽지 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 쪽지 내용 조회
export const fetchLetterContent = async (teamId, letterId) => {
  try {
    const res = await api.get(`/api/teams/${teamId}/letters/${letterId}`);
    return res.data?.data?.content || "";
  } catch (error) {
    console.error("쪽지 내용 조회 실패:", error);
    throw error;
  }
};

// 팀 명함 전체 목록 조회
export const fetchTeamCards = async (teamId) => {
  try {
    const res = await api.get(`/api/cards/teams/${teamId}/cards`);
    return res.data || [];
  } catch (error) {
    console.error("팀 명함 전체 목록 조회 실패:", error);
    throw error;
  }
};

// 내가 현재 팀에서 사용 중인 명함 정보 조회
export const fetchMyCardInTeam = async (teamId) => {
  try {
    const res = await api.get(`/api/cards/teams/${teamId}/cards/my`);
    return res.data;
  } catch (error) {
    console.error("내 명함 정보 조회 실패:", error);
    throw error;
  }
};

// 쪽지 전송
export const sendLetter = async (teamId, cardId, content) => {
  try {
    await api.post(`/api/teams/${teamId}/cards/${cardId}/letters`, { content });
  } catch (error) {
    console.error("쪽지 전송 실패:", error);
    throw error;
  }
};
