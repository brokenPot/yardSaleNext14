import { z } from "zod";

export const productSchema = z.object({
    productId: z.coerce.number().optional(),
    image: z.any({
        required_error: "Image is required",
    }),
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
    price: z.coerce.number({
        required_error: "Price is required",
    }),
});

export type ProductType = z.infer<typeof productSchema>;

// export interface ProductType {
//     productId: Number,
//     image: any,
//     title: string,
//     description: string,
//     price: Number,
// }