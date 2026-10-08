import { redirect } from "react-router-dom";

export const authMiddleware = async () => {
    const accessToken =
        localStorage.getItem("accessToken");

    if (!accessToken) {
        throw redirect("/login");
    }
};