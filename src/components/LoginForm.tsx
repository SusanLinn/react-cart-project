import {
    useState,
    type FormEvent,
} from "react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    useNavigate,
} from "react-router-dom";

import { z } from "zod";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import api from "../services/api";

import {
    loginResponseSchema,
    loginSchema,
    type LoginData,
    type LoginResponse,
} from "../schemas/authSchemas";

import {
    userSchema,
} from "../schemas/userSchemas";

import type { User } from "../types";

interface LoginResult {
    accessToken: string;
    user: User;
}

const LoginForm = () => {
    const navigate =
        useNavigate();

    const queryClient =
        useQueryClient();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [
        usernameError,
        setUsernameError,
    ] = useState("");

    const [
        passwordError,
        setPasswordError,
    ] = useState("");

    const [error, setError] =
        useState("");

    const loginMutation =
        useMutation<
            LoginResult,
            Error,
            LoginData
        >({
            mutationFn: async (
                loginData
            ) => {
                const response =
                    await api.post(
                        "/auth/login",
                        loginData
                    );

                const loginResponse:
                    LoginResponse =
                    loginResponseSchema.parse(
                        response.data
                    );

                const accessToken =
                    loginResponse
                        .accessToken;

                const userResponse =
                    await api.get(
                        "/auth/me",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${accessToken}`,
                            },
                        }
                    );

                const user: User =
                    userSchema.parse(
                        userResponse.data
                    );

                return {
                    accessToken,
                    user,
                };
            },

            onSuccess: ({
                accessToken,
                user,
            }) => {
                localStorage.setItem(
                    "accessToken",
                    accessToken
                );

                localStorage.setItem(
                    "userId",
                    String(user.id)
                );

                queryClient.setQueryData<User>(
                    [
                        "currentUser",
                        String(user.id),
                    ],
                    user
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
            },

            onError: (
                mutationError
            ) => {
                if (
                    mutationError instanceof
                    z.ZodError
                ) {
                    setError(
                        "Invalid server response."
                    );

                    return;
                }

                setError(
                    "Invalid username or password."
                );
            },
        });

    const handleSubmit = (
        event:
            FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setUsernameError("");
        setPasswordError("");
        setError("");

        const validationResult =
            loginSchema.safeParse({
                username,
                password,
            });

        if (
            !validationResult.success
        ) {
            const fieldErrors =
                z.flattenError(
                    validationResult.error
                ).fieldErrors;

            setUsernameError(
                fieldErrors
                    .username?.[0] ??
                    ""
            );

            setPasswordError(
                fieldErrors
                    .password?.[0] ??
                    ""
            );

            return;
        }

        loginMutation.mutate(
            validationResult.data
        );
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
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Username"
                                value={
                                    username
                                }
                                onChange={(
                                    event
                                ) =>
                                    setUsername(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            {usernameError && (
                                <p className="text-sm text-red-600">
                                    {
                                        usernameError
                                    }
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={
                                    password
                                }
                                onChange={(
                                    event
                                ) =>
                                    setPassword(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />

                            {passwordError && (
                                <p className="text-sm text-red-600">
                                    {
                                        passwordError
                                    }
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
                            disabled={
                                loginMutation
                                    .isPending
                            }
                        >
                            {loginMutation
                                .isPending
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