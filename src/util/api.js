import axios from "axios";

const baseURL = "https://icey-backend-1027532113913.asia-northeast3.run.app";

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseURL}/api/refresh`, null, {
          headers: {
            Refresh: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        });

        const newAccessToken = res.data.accessToken;

        // ✅ 콘솔에 새 토큰 출력
        console.log("🔄 새로운 accessToken 발급:", newAccessToken);

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ 토큰 재발급 실패, 로그아웃 진행");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
