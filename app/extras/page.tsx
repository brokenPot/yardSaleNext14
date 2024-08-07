import Image from "next/image";
import view from "../../public/heavy-image.jpeg"

// 폴더 명 앞에 _을 그으면 라우팅을 안할수 있다. -> 비공개 처리 할 수 있다
export default function Extras() {
    return (
        <div className="flex flex-col gap-3 py-10">
            <h1 className="text-6xl font-metallica">Extras!</h1>
            <h2 className="text-6xl font-rubick">Extras!</h2>
            <h2 className="font-roboto">So much more to learn!</h2>
            <Image src={view} alt='' placeholder="blur"/>
        </div>
    );
}