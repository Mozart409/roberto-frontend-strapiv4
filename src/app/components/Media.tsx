import Image from "next/image";
import { getStrapiMedia } from "../utils/api-helpers";

interface MediaProps {
  file: {
    data: {
      id: string;
      attributes: {
        url: string;
        name: string;
        alternativeText: string;
      };
    };
  };
}

export default function Media({ data }: { data: MediaProps }) {
  const imgUrl = getStrapiMedia(data.file.data.attributes.url);
  return (
    <div className="flex justify-center items-center mt-8 h-72 sm:h-80 lg:mt-0 lg:h-96 xl:h-112 2xl:h-128">
      <Image
        src={imgUrl || ""}
        alt={data.file.data.attributes.alternativeText || "none provided"}
        className="object-cover overflow-hidden w-full h-full rounded-lg"
        width={400}
        height={400}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}
