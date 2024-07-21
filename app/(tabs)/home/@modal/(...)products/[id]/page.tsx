import ModalBtn from "@/components/modal-btn";
import {notFound} from "next/navigation";
import Image from "next/image";
import {getProduct} from "@/app/(tabs)/home/@modal/(...)products/[id]/actions";
export default async function Modal({ params }: { params: { id: string } }) {
    const id = +params.id;
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);

    if (!product) {
        return notFound();
    }
    // console.log(product)
    return (
        <div
            className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
            <ModalBtn/>

            <div className="flex justify-center w-full max-w-screen-sm h-1/2">
                <div
                    className="relative flex items-center justify-center overflow-hidden rounded-md aspect-square bg-neutral-700 text-neutral-200">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />

                </div>
            </div>
            <div className="flex-col justify-evenly text-xs text-white">
                <div>
                    {product.title}
                </div>
                <div>
                    {product.user.name}
                </div>
                <div>
                    {product.description}
                </div>
                <div>
                    press refresh if you wanna see more detail!
                </div>
            </div>
        </div>
    );
}