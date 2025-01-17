import ModalBtn from "@/components/modal-btn";
import {notFound} from "next/navigation";
import Image from "next/image";
import {getProduct} from "@/app/(tabs)/home/@modal/(...)products/[id]/actions";
export default async function Modal({ params }: { params: { id: string } }) {
    // const id = +params.id;

    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
        return notFound();
    }
    const product = await getProduct(numericId);

    if (!product) {
        return notFound();
    }
    return (
        <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
            <ModalBtn/>
            <div className="flex-col justify-center w-5/12  max-w-screen-sm h-5/12">
                <div
                    className="relative flex items-center justify-center  overflow-hidden rounded-md aspect-square bg-neutral-700 text-neutral-200 ">
                    <Image
                        src={product.image}
                        alt={product.title}
                        sizes="500"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-col justify-evenly text-xs text-white">
                    <div className="text-lg text-center font-bold mb-2">
                        {product.title}
                    </div>
                    <div className="text-xs text-center font-medium mb-2">
                        SELLER : {product.user.name}
                    </div>
                    <div className="text-xs text-center mb-2">
                        {product.description}
                    </div>
                    <div className="text-center">
                        press F5 if you wanna see more detail!
                    </div>
                </div>
            </div>
        </div>
    );
}