import api from "./api";

// 내 명함 전체 목록 조회 (내 카드 + 사용중인 팀 목록 포함)
export const fetchMyCards = async () => {
  try {
    const res = await api.get("/api/cards");

    // 각 카드별 사용 팀 목록 추가
    const cardsWithTeams = await Promise.all(
      res.data.map(async (card) => {
        try {
          const teamRes = await api.get(
            `/api/cards/${card.templateId}/used-teams`,
          );
          return { ...card, teams: teamRes.data.map((team) => team.name) };
        } catch {
          return { ...card, teams: [] };
        }
      }),
    );

    return cardsWithTeams;
  } catch (error) {
    console.error("내 명함 불러오기 실패", error);
    throw error;
  }
};

// 특정 팀 내에서 내가 사용 중인 명함 조회
export const fetchCurrentTeamCard = async (teamId) => {
  try {
    if (!teamId) return null;
    const res = await api.get(`/api/cards/teams/${teamId}/cards/my`);
    return res.data;
  } catch (error) {
    console.error("현재 팀에서 내 명함 불러오기 실패", error);
    return null;
  }
};

// 명함 생성
export const createCard = async (cardData) => {
  try {
    const res = await api.post("/api/cards", cardData);
    return res.data;
  } catch (error) {
    console.error("명함 생성 실패", error);
    throw error;
  }
};

// 명함 수정
export const updateCard = async (cardId, cardData) => {
  try {
    await api.patch(`/api/cards/${cardId}`, cardData);
  } catch (error) {
    console.error("명함 수정 실패", error);
    throw error;
  }
};

// 명함 삭제
export const deleteCard = async (cardId) => {
  try {
    await api.delete(`/api/cards/${cardId}`);
  } catch (error) {
    console.error("명함 삭제 실패", error);
    throw error;
  }
};

// 현재 팀 내에서 사용할 명함 설정
export const selectCardForTeam = async (teamId, templateId) => {
  try {
    await api.put(`/api/cards/teams/${teamId}/cards/my-card`, null, {
      params: { templateId },
    });
  } catch (error) {
    console.error("팀에 명함 설정 실패", error);
    throw error;
  }
};

// 특정 팀 내 명함 전체 목록 조회
export const fetchTeamCards = async (teamId) => {
  try {
    const res = await api.get(`/api/cards/teams/${teamId}/cards`);
    return res.data || [];
  } catch (error) {
    console.error("팀 명함 목록 불러오기 실패", error);
    return [];
  }
};
