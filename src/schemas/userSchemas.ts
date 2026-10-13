import { z } from "zod";

export const addressSchema =
    z.object({
        address:
            z.string(),

        city:
            z.string(),

        state:
            z.string(),

        stateCode:
            z.string(),

        postalCode:
            z.string(),

        country:
            z.string(),
    });

export const companySchema =
    z.object({
        department:
            z.string(),

        name:
            z.string(),

        title:
            z.string(),

        address:
            addressSchema,
    });

export const userSchema =
    z.object({
        id:
            z.number(),

        firstName:
            z.string(),

        lastName:
            z.string(),

        maidenName:
            z.string(),

        age:
            z.number(),

        gender:
            z.string(),

        email:
            z.string(),

        phone:
            z.string(),

        username:
            z.string(),

        birthDate:
            z.string(),

        image:
            z.string(),

        address:
            addressSchema,

        university:
            z.string(),

        company:
            companySchema,

        role:
            z.string(),
    });