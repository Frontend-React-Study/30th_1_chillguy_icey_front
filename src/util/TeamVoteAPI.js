import api from "./api";

// 팀 날짜 투표 저장
export const fetchTeamVoteCreate = async (teamId, candidateDates) => {
  try {
    console.log("candidateDates : ", candidateDates);
    const response = await api.post(`/api/teams/${teamId}/schedule`, {
      candidateDates: candidateDates,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("약속 잡기 생성 실패:", error);
    throw error;
  }
};

// 특정 팀 총 투표만 조회
export const fetchTeamVoteOnlySummery = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}/schedule/votes`);
    console.log("팀 총 투표 요약 조회 성공");
    return response.data;
  } catch (error) {
    console.error("팀 총 투표 요약만 조회 실패", error);
  }
};

// 특정 팀 총 투표 요약 상세 조회
export const fetchTeamVotesSummary = async (teamId) => {
  try {
    const response = await api.get(
      `/api/teams/${teamId}/schedule/votes-summary`,
    );
    console.log("팀 투표 총 요약 데이터 불러오기 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("팀 투표 총 요약 데이터 불러오기 실패:", error);
    throw error;
  }
};

// 팀 내 투표 데이터 조회
export const fetchTeamMyVotes = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}/schedule/votes-mine`);
    console.log("팀 내 투표 데이터 불러오기 성공:", response.data.data);
    return response.data;
  } catch (error) {
    console.error("팀 내 투표 데이터 불러오기 실패:", error);
    throw error;
  }
};

// 팀 내 시간 투표 수정
export const fetchTeamVoteSave = async (teamId, votes) => {
  try {
    const response = await api.post(`/api/teams/${teamId}/schedule/votes`, {
      votes: votes,
    });
    console.log("내 투표 데이터 저장 성공: ", response.data);
    return response.data;
  } catch (error) {
    console.error("해당 팀에서 투표한 데이터 저장 실패", error);
    throw error;
  }
};

// 과반수 Candidates 조회
export const fetchMaxCandidates = async (teamId) => {
  try {
    const response = await api.get(
      `/api/teams/${teamId}/schedule/best-candidate`,
    );
    return response.data;
  } catch (error) {
    console.error("과반수 이상 투표된 날짜 및 시간 조회 실패:", error);
    throw error;
  }
};

// Candidates 확정
export const fetchScheduleConfirm = async (teamId, schedule) => {
  try {
    console.log(`${schedule.date}`, Number(schedule.hour));
    const response = await api.post(`/api/teams/${teamId}/schedule/confirm`, {
      date: `${schedule.date}`,
      hour: Number(schedule.hour),
    });
    console.log("약속 잡기 스케줄 확정 성공:", response.data);
  } catch (error) {
    console.error("약속 잡기 스케줄 확정 실패:", error);
    throw error;
  }
};
