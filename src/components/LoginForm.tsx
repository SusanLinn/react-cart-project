import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import api from "../services/api";
import type { User } from "../types";

const LoginForm = () => {
    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [usernameError, setUsernameError] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setUsernameError("");
        setPasswordError("");
        setError("");

        if (!username.trim()) {
            setUsernameError(
                "Username is required."
            );
        }

        if (!password.trim()) {
            setPasswordError(
                "Password is required."
            );
        }

        if (
            !username.trim() ||
            !password.trim()
        ) {
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/login",
                {
                    username,
                    password,
                }
            );

            const accessToken =
                response.data.accessToken;

            localStorage.setItem(
                "accessToken",
                accessToken
            );

            const userResponse =
                await api.get<User>(
                    "/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

            localStorage.setItem(
                "userId",
                String(userResponse.data.id)
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

            navigate(
                "/products",
                {
                    replace: true,
                }
            );
        } catch {
            setError(
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Login
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                            />

                            {usernameError && (
                                <p className="text-sm text-red-600">
                                    {usernameError}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                            />

                            {passwordError && (
                                <p className="text-sm text-red-600">
                                    {passwordError}
                                </p>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginForm;