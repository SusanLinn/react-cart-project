import {
    useState,
} from "react";

import {
    useForm,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

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

import FormErrorMessage from "./FormErrorMessage";

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

import type {
    User,
} from "../types";


interface LoginResult {
    accessToken: string;
    user: User;
}


const LoginForm = () => {

    const navigate =
        useNavigate();

    const queryClient =
        useQueryClient();

    const [
        loginError,
        setLoginError,
    ] = useState("");


    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm<LoginData>({
        resolver:
            zodResolver(
                loginSchema
            ),

        mode: "onSubmit",

        reValidateMode:
            "onSubmit",

        defaultValues: {
            username: "",
            password: "",
        },
    });


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
                    String(
                        user.id
                    )
                );

                queryClient.setQueryData<User>(
                    [
                        "currentUser",
                        String(
                            user.id
                        ),
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
                    setLoginError(
                        "Invalid server response."
                    );

                    return;
                }

                setLoginError(
                    "Invalid username or password."
                );
            },
        });


    const clearLoginError = () => {
        setLoginError("");
    };


    const onSubmit = (
        data: LoginData
    ) => {

        clearLoginError();

        loginMutation.mutate(
            data
        );
    };


    const onInvalid = () => {
        clearLoginError();
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
                            handleSubmit(
                                onSubmit,
                                onInvalid
                            )
                        }
                        className="space-y-4"
                    >

                        <div className="space-y-2">

                            <Input
                                type="text"
                                placeholder="Username"
                                {...register(
                                    "username",
                                    {
                                        onChange:
                                            clearLoginError,
                                    }
                                )}
                            />

                            <FormErrorMessage
                                message={
                                    errors
                                        .username
                                        ?.message
                                }
                            />

                        </div>


                        <div className="space-y-2">

                            <Input
                                type="password"
                                placeholder="Password"
                                {...register(
                                    "password",
                                    {
                                        onChange:
                                            clearLoginError,
                                    }
                                )}
                            />

                            <FormErrorMessage
                                message={
                                    errors
                                        .password
                                        ?.message
                                }
                            />

                        </div>


                        <FormErrorMessage
                            message={
                                loginError
                            }
                        />


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