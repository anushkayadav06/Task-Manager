export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },

    USERS: {
        GET_ALL_USERS: "/api/users",
        GET_USERS_BY_ID: (userId) => `/api/users/${userId}`,
        CREATE_USER:"/api/users",//create new user admin only
        UPDATE_USER:(userId) => `/api/users/${userId}`,
    },

    TASKS:{
        GET_DASHBOARD_DATA:"/api/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data",
        GET_ALL_TASKS:"/api/tasks",
        GET_TASKS_BY_ID:(taskId)=>`/api/tasks/${taskId}`,
        CREATE_TASK:"/api/tasks",
        UPDATE_TASKS:(taskId)=>`/api/tasks/${taskId}`,
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,

        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`,
    },
}