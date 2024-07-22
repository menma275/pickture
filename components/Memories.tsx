import UploadImage from "./UploadImage";
import DisplayImage from "./DisplayImage";
// import { useSearchParams } from "next/navigation"

export default function Memories() {
    // const searchParams = useSearchParams();
    // const showUpload = searchParams.get("upload") === process.env.UPLOAD_KEY;
    return (
        <div className="w-full h-full">
            {/* {showUpload && <UploadImage />} */}
            <DisplayImage />
        </div>
    );
}