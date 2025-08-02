import api from "./api";

// 메모 목록 조회
export const fetchMemos = async (teamId) => {
  try {
    const res = await api.get(`/api/teams/${teamId}/memos`);
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  } catch (error) {
    throw new Error("메모 목록 조회에 실패했습니다.");
  }
};

// 메모 삭제
export const deleteMemo = async (teamId, memoId) => {
  try {
    await api.delete(`/api/teams/${teamId}/memos/${memoId}`);
  } catch (error) {
    throw new Error("메모 삭제에 실패했습니다.");
  }
};

// 밸런스 게임 목록 조회
export const fetchBalanceGames = async (teamId) => {
  try {
    const res = await api.get(`/api/teams/${teamId}/balance-game`);
    return res.data?.data ?? [];
  } catch (error) {
    throw new Error("밸런스 게임 목록 조회에 실패했습니다.");
  }
};

// 밸런스 게임 생성
export const createBalanceGame = async (teamId) => {
  try {
    const res = await api.post(`/api/teams/${teamId}/balance-game/generate`);
    return res.data?.data;
  } catch (error) {
    throw new Error("밸런스 게임 생성에 실패했습니다.");
  }
};

// 밸런스 게임 삭제
export const deleteBalanceGame = async (teamId, gameId) => {
  try {
    await api.delete(`/api/teams/${teamId}/balance-game/${gameId}/delete`);
  } catch (error) {
    throw new Error("밸런스 게임 삭제에 실패했습니다.");
  }
};

// 밸런스 게임 투표
export const voteBalanceGame = async (teamId, gameId, selectedOption) => {
  try {
    await api.post(`/api/teams/${teamId}/balance-game/${gameId}/vote`, {
      selectedOption: Number(selectedOption),
    });
  } catch (error) {
    throw new Error("밸런스 게임 투표에 실패했습니다.");
  }
};

// 밸런스 게임 투표 결과 조회
export const fetchBalanceGameResult = async (teamId, gameId) => {
  try {
    const res = await api.get(
      `/api/teams/${teamId}/balance-game/${gameId}/result`,
    );
    return res.data;
  } catch {
    // 실패 시 기본값 반환 (투표수 0)
    return { totalVotes: 0 };
  }
};

// 메모 상세 내용 조회
export const fetchMemoDetail = async (teamId, memoId) => {
  try {
    const res = await api.get(`/api/teams/${teamId}/memos/${memoId}`);
    return res.data;
  } catch (error) {
    throw new Error("메모 상세 내용 조회에 실패했습니다.");
  }
};

// 메모 좋아요 토글
export const toggleMemoLike = async (teamId, memoId) => {
  try {
    const res = await api.post(
      `/api/teams/${teamId}/memos/${memoId}/reactions`,
    );
    return res.data;
  } catch (error) {
    throw new Error("메모 좋아요 처리에 실패했습니다.");
  }
};

// 메모 생성 또는 수정
export const saveMemo = async (teamId, content, memoId = null) => {
  try {
    const url = memoId
      ? `/api/teams/${teamId}/memos/${memoId}`
      : `/api/teams/${teamId}/memos`;
    const method = memoId ? "put" : "post";

    const res = await api({
      method,
      url,
      data: { content },
    });

    return res.data;
  } catch (error) {
    throw new Error("메모 저장에 실패했습니다.");
  }
};
