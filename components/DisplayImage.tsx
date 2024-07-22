"use client";
import { useEffect, useState, CSSProperties } from "react";
import { db } from "@/lib/firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import Image from "next/image";
import { motion } from "framer-motion";
import { url } from "inspector";

interface ImageType {
    url: string;
    name: string;
    timestamp: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    metadata: any;
}

interface PreviewImageSize {
    width: number;
    height: number;
}

interface ImageSize {
    landscape: {
        width: number;
        height: number;
    },
    portrait: {
        width: number;
        height: number;
    }
}

interface ImagePosition {
    top: string;
    left: string;
    transform: string;
}

const sortImages = (images: ImageType[]) => {
    images.sort((a, b) => {
        const dateA: Date = new Date(a.timestamp.year, a.timestamp.month - 1, a.timestamp.day, a.timestamp.hour, a.timestamp.minute, a.timestamp.second);
        const dateB: Date = new Date(b.timestamp.year, b.timestamp.month - 1, b.timestamp.day, b.timestamp.hour, b.timestamp.minute, b.timestamp.second);
        return dateB.getTime() - dateA.getTime();
    });
}

const randomPosition = (num: number): { positions: ImagePosition[], rotations: number[] } => {
    const positions: ImagePosition[] = [];
    const rotations: number[] = [];
    const rows = Math.ceil(Math.sqrt(num));
    const cols = Math.ceil(num / rows);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;

    for (let i = 0; i < num; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const rotation = Math.random() * 15 * (Math.random() * 2 - 1);
        positions.push({
            top: `
                ${(cellHeight / 2 + (Math.random() * cellHeight - cellHeight / 2) + row * cellHeight) * 0.8 + 10}%
            `,
            left: `
                ${(cellWidth / 2 + (Math.random() * cellWidth - cellWidth / 2) + col * cellWidth) * 0.8 + 10}%
        `,
            transform: `rotate(${rotation}deg)`,
        });
        rotations.push(Math.random() * 15 * (Math.random() * 2 - 1));
    }
    return { positions, rotations };
};

const DisplayImage = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const [previewImage, setPreviewImage] = useState<ImageType>({ url: "", name: "", timestamp: { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 }, metadata: {} });
    const [loading, setLoading] = useState<boolean>(true);
    const [positions, setPositions] = useState<ImagePosition[]>([]);
    const [rotations, setRotations] = useState<number[]>([]);
    const [previewImageSize, setPreviewImageSize] = useState<PreviewImageSize>({ width: 0, height: 0 });

    const setPreview = (image: ImageType | null) => {
        if (image === null || previewImage?.url === image.url) {
            setPreviewImage({
                url: "",
                name: "",
                timestamp: { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 },
                metadata: {},
            });
        } else
            setPreviewImage(image);
    }

    // 画像を取得してソート
    useEffect(() => {
        const imagesRef = ref(db, "images/");
        onValue(imagesRef, (snapshot) => {
            const data = snapshot.val();
            const imageList = [];
            for (let id in data) {
                imageList.push(data[id]);
            }
            setImages(imageList);
            sortImages(imageList);
            setLoading(false);
            console.log(imageList);
        });
    }, []);

    // 画像の位置をランダムに設定
    useEffect(() => {
        const { positions, rotations } = randomPosition(images.length);
        setPositions(positions);
        setRotations(rotations);
    }, [images]);

    // 拡大時の画像サイズを設定
    useEffect(() => {
        if (previewImage) {
            const aspectRatio = previewImage.metadata.ExifImageWidth / previewImage.metadata.ExifImageHeight;
            if (innerWidth < 1400) {
                const width = innerWidth > innerHeight
                    ? innerHeight * 0.85 * aspectRatio
                    : innerWidth * 0.85;
                const height = innerWidth > innerHeight
                    ? innerHeight * 0.85
                    : innerWidth * 0.85 / aspectRatio;
                setPreviewImageSize({
                    width: width,
                    height: height,
                });
            } else {
                setPreviewImageSize({
                    width: 500,
                    height: 500 / aspectRatio,
                });
            }

        }
    }, [previewImage]);

    return (
        <div className="relative overflow-hidden w-wull h-full">
            <div className="absolute inset-0" onClick={(e) => { e.stopPropagation(); setPreview(null) }} />
            {images.map((image, index) => (
                <motion.div
                    key={index}
                    className="absolute h-32 sm:h-48 cursor-pointer"
                    style={{
                        ...positions[index],
                        transform: `rotate(${rotations[index]}deg)`,
                        aspectRatio: `${image.metadata.ExifImageWidth}/${image.metadata.ExifImageHeight}`,
                        translate: "-50% -50%",
                    }}
                    onClick={() => setPreview(image)}
                    animate={
                        previewImage?.url === "" ? {
                            x: 0,
                            y: 0,
                            rotate: rotations[index],
                        } : previewImage?.url === image.url ? {
                            width: `${previewImageSize.width}px`,
                            height: `${previewImageSize.height}px`,
                            zIndex: 1,
                            x: `${50 - parseFloat(positions[index]?.left)}dvw`,
                            y: `${50 - parseFloat(positions[index]?.top)}dvh`,
                            rotate: 0,
                        } : (previewImage?.url !== "" && previewImage?.url !== image.url) && {
                            x: `${- (50 - parseFloat(positions[index]?.left)) / 2}dvw`,
                            y: `${- (50 - parseFloat(positions[index]?.top)) / 2}dvh`,
                            rotate: rotations[index],
                        }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
                >
                    <Image
                        src={image.url}
                        alt={image.name}
                        layout="fill"
                        className="object-contain shadow-md bg-white ring-2 ring-white"
                    />
                </motion.div >
            ))
            }
        </div >
    );
}

export default DisplayImage