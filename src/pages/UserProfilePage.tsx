import {
    useEffect,
    type ReactNode,
} from "react";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    ArrowLeft,
    BriefcaseBusiness,
    GraduationCap,
    MapPin,
    UserRound,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../components/ui/avatar";

import api from "../services/api";

import type { User } from "../types";

import {
    userSchema,
} from "../schemas/userSchemas";

interface DetailRowProps {
    label: string;
    value: ReactNode;
}

const DetailRow = ({
    label,
    value,
}: DetailRowProps) => {
    return (
        <div className="grid gap-2 border-b py-4 last:border-b-0 sm:grid-cols-[180px_1fr]">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <div className="text-sm font-medium">
                {value || "—"}
            </div>
        </div>
    );
};

const UserProfilePage = () => {
    const navigate = useNavigate();

    const accessToken =
        localStorage.getItem(
            "accessToken"
        );

    const userId =
        localStorage.getItem(
            "userId"
        );

    const {
        data: user,
        isPending: userLoading,
        isError: userIsError,
    } = useQuery<User>({
        queryKey: [
            "currentUser",
            userId,
        ],

        queryFn: async () => {
            const response =
                await api.get(
                    "/auth/me"
                );

            return userSchema.parse(
                response.data
            );
        },
        enabled: Boolean(
            accessToken
        ),

        retry: false,
    });

    useEffect(() => {
        if (!accessToken) {
            navigate(
                "/login",
                {
                    replace: true,
                }
            );
        }
    }, [
        accessToken,
        navigate,
    ]);

    const handleLogout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "userId"
        );

        window.dispatchEvent(
            new Event(
                "theme-user-changed"
            )
        );

        window.dispatchEvent(
            new Event(
                "cart-user-changed"
            )
        );

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };

    const formatBirthDate = (
        birthDate: string
    ) => {
        return new Date(
            birthDate
        ).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    if (userLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>
                    Loading profile...
                </p>
            </div>
        );
    }

    if (
        userIsError ||
        !user
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        Failed to load user
                        profile.
                    </p>

                    <Link
                        to="/products"
                        className="mt-4 inline-block underline"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const initials =
        `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`
            .toUpperCase();

    const fullAddress =
        `${user.address.address}, ${user.address.city}`;

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                user={user}
                onLogout={handleLogout}
            />

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <Link
                    to="/products"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />

                    Back to Products
                </Link>

                <section className="mb-8 rounded-2xl border bg-background p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <Avatar className="size-28 border">
                            <AvatarImage
                                src={
                                    user.image
                                }
                                alt={`${user.firstName} ${user.lastName}`}
                            />

                            <AvatarFallback className="text-2xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold">
                                    {
                                        user.firstName
                                    }{" "}
                                    {
                                        user.lastName
                                    }
                                </h1>

                                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase">
                                    {
                                        user.role
                                    }
                                </span>
                            </div>

                            <p className="mt-2 text-muted-foreground">
                                @
                                {
                                    user.username
                                }
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {
                                    user.email
                                }
                            </p>
                        </div>
                    </div>
                </section>

                <div className="space-y-6">
                    <section className="rounded-2xl border bg-background">
                        <div className="flex items-center gap-2 border-b px-6 py-5">
                            <UserRound className="size-5" />

                            <h2 className="font-semibold">
                                Personal Details
                            </h2>
                        </div>

                        <div className="px-6">
                            <DetailRow
                                label="Full Name"
                                value={`${user.firstName} ${user.lastName}`}
                            />

                            <DetailRow
                                label="Username"
                                value={`@${user.username}`}
                            />

                            <DetailRow
                                label="Date of Birth"
                                value={formatBirthDate(
                                    user.birthDate
                                )}
                            />

                            <DetailRow
                                label="Age"
                                value={
                                    user.age
                                }
                            />

                            <DetailRow
                                label="Gender"
                                value={
                                    <span className="capitalize">
                                        {
                                            user.gender
                                        }
                                    </span>
                                }
                            />

                            <DetailRow
                                label="Phone Number"
                                value={
                                    user.phone
                                }
                            />

                            <DetailRow
                                label="Email"
                                value={
                                    user.email
                                }
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border bg-background">
                        <div className="flex items-center gap-2 border-b px-6 py-5">
                            <MapPin className="size-5" />

                            <h2 className="font-semibold">
                                Address
                            </h2>
                        </div>

                        <div className="px-6">
                            <DetailRow
                                label="Address"
                                value={
                                    fullAddress
                                }
                            />

                            <DetailRow
                                label="State"
                                value={`${user.address.state} (${user.address.stateCode})`}
                            />

                            <DetailRow
                                label="Postal Code"
                                value={
                                    user.address
                                        .postalCode
                                }
                            />

                            <DetailRow
                                label="Country"
                                value={
                                    user.address
                                        .country
                                }
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border bg-background">
                        <div className="flex items-center gap-2 border-b px-6 py-5">
                            <GraduationCap className="size-5" />

                            <h2 className="font-semibold">
                                Education
                            </h2>
                        </div>

                        <div className="px-6">
                            <DetailRow
                                label="University"
                                value={
                                    user.university
                                }
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border bg-background">
                        <div className="flex items-center gap-2 border-b px-6 py-5">
                            <BriefcaseBusiness className="size-5" />

                            <h2 className="font-semibold">
                                Employment
                            </h2>
                        </div>

                        <div className="px-6">
                            <DetailRow
                                label="Company"
                                value={
                                    user.company
                                        .name
                                }
                            />

                            <DetailRow
                                label="Job Title"
                                value={
                                    user.company
                                        .title
                                }
                            />

                            <DetailRow
                                label="Department"
                                value={
                                    user.company
                                        .department
                                }
                            />

                            <DetailRow
                                label="Company Location"
                                value={`${user.company.address.city}, ${user.company.address.country}`}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;