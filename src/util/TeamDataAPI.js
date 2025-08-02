import axios from "axios";
import api from "./api";

// 팀 전체 목록 조회
export const fetchTeamList = async () => {
  try {
    const response = await api.get(`/api/teams`);
    return response.data;
  } catch (error) {
    console.error("팀 리스트 불러오기 실패:", error);
    throw error;
  }
};

// 특정 팀 상세 조회
export const fetchTeamDetail = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("팀 상세 정보 불러오기 실패:", error);
    throw error;
  }
};

// 팀 생성
export const createTeam = async (teamName) => {
  try {
    const response = await api.post(`/api/teams`, {
      teamName: `${teamName}`,
    });
    console.log("팀 생성 완료:", response.data);
    return response.data;
  } catch (error) {
    console.error("팀 생성 실패:", error);
    throw error;
  }
};

// 특정 팀 링크 조회
export const fetchTeamLink = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}/invitation`);
    return response.data;
  } catch (error) {
    console.error("팀 상세 정보 불러오기 실패:", error);
    throw error;
  }
};

// 초대 링크 토큰으로 팀 정보 조회
export const fetchCheckTeamLinkToken = async (invitationToken) => {
  try {
    const response = await api.get(`/api/teams/invitation/${invitationToken}`);
    console.log("팀 링크 토큰을 통해 정보를 불러왔습니다 : ", response);
    return response.data;
  } catch (error) {
    console.error("팀 링크 토큰을 통해 정보를 불러오지 못했습니다.");
    throw error;
  }
};

// 초대 수락 (특수 에러 처리 유지)
export const fetchAcceptTeamLink = async (invitationToken) => {
  try {
    const response = await api.post(`/api/teams/invitation/${invitationToken}`);
    console.log("링크 토큰을 통해 팀 초대를 수락하였습니다.", response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      console.error(`${status} 에러 :`, error.response);
      return error.response.data;
    } else {
      console.log("네트워크 오류", error.response.data);
      throw error;
    }
  }
};

// 내 명함 목록 (특정 팀 내)
export const fetchTeamCardM = async (teamId) => {
  try {
    const response = await api.get(`/api/cards/teams/${teamId}/cards/my`);
    console.log("팀 명함 전체 목록 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("팀 명함 전체 목록 조회 실패:", error);
    throw error;
  }
};
