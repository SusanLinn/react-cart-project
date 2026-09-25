import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env
            .VITE_API_BASE_URL,

    headers: {
        "Content-Type":
            "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken =
            localStorage.getItem(
                "accessToken"
            );

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(
            error
        );
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status =
            error.response?.status;

        const requestUrl =
            error.config?.url;

        const isLoginRequest =
            requestUrl ===
            "/auth/login";

        if (
            status === 401 &&
            !isLoginRequest
        ) {
            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "userId"
            );

            window.dispatchEvent(
                new Event(
                    "cart-user-changed"
                )
            );

            window.dispatchEvent(
                new Event(
                    "theme-user-changed"
                )
            );

            window.location.replace(
                "/login"
            );
        }

        return Promise.reject(
            error
        );
    }
);

export default api;