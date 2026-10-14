import { z } from "zod";

export const reviewSchema =
    z.object({
        rating: z.number(),
        comment: z.string(),
        date: z.string(),
        reviewerName: z.string(),
        reviewerEmail: z.string(),
    });

export const productSchema =
    z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.number(),
        discountPercentage:
            z.number(),
        rating: z.number(),
        stock: z.number(),

        brand:
            z.string().optional(),

        sku: z.string(),

        warrantyInformation:
            z.string(),

        shippingInformation:
            z.string(),

        availabilityStatus:
            z.string(),

        returnPolicy:
            z.string(),

        thumbnail:
            z.string(),

        images:
            z.array(
                z.string()
            ),

        reviews:
            z.array(
                reviewSchema
            ),
    });

export const productsResponseSchema =
    z.object({
        products:
            z.array(
                productSchema
            ),

        total: z.number(),
        skip: z.number(),
        limit: z.number(),
    });

export const categorySchema =
    z.object({
        slug: z.string(),
        name: z.string(),
        url: z.string(),
    });

export const categoriesSchema =
    z.array(
        categorySchema
    );