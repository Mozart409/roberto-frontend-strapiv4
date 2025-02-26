import { getStrapiMedia } from "@/app/utils/api-helpers";
import Image from "next/image";

interface CustomImageProps {
  media?: IMedia;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const NextImage = ({ media, ...props }: CustomImageProps) => {
  const img = media?.data.attributes;
  const fullUrl = img ? getStrapiMedia(img.url) : "";

  if (!fullUrl) {
    return <div>no media</div>;
  }

  return (
    <div>
      <Image
        src={fullUrl}
        alt={img?.alternativeText || ""}
        title={img?.caption || ""}
        className={props.className}
        width={Number.parseInt(props.width as string) || img?.width}
        height={Number.parseInt(props.height as string) || img?.height}
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default NextImage;
