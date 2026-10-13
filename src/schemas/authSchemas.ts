import { z } from "zod";

export const loginSchema =
    z.object({
        username:
            z
                .string()
                .refine(
                    (value) =>
                        value.trim()
                            .length > 0,
                    {
                        error:
                            "Username is required.",
                    }
                ),

        password:
            z
                .string()
                .refine(
                    (value) =>
                        value.trim()
                            .length > 0,
                    {
                        error:
                            "Password is required.",
                    }
                ),
    });

export const loginResponseSchema =
    z.object({
        accessToken:
            z.string(),
    });

export type LoginData =
    z.infer<
        typeof loginSchema
    >;

export type LoginResponse =
    z.infer<
        typeof loginResponseSchema
    >;