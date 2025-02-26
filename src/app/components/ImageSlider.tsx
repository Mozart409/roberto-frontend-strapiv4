"use client";
import Image from "next/image";
import { Fade } from "react-slideshow-image";
import { getStrapiMedia } from "../utils/api-helpers";

interface Image {
  id: number;
  attributes: {
    alternativeText: string | null;
    caption: string | null;
    url: string;
  };
}

interface SlidShowProps {
  files: {
    data: Image[];
  };
}

export default function Slideshow({ data }: { data: SlidShowProps }) {
  return (
    <div className="slide-container">
      <Fade>
        {data.files.data.map((fadeImage: Image, index) => {
          const imageUrl = getStrapiMedia(fadeImage.attributes.url);
          return (
            <div key={index}>
              {imageUrl && (
                <Image
                  className="object-cover w-full h-96 rounded-lg"
                  height={400}
                  width={600}
                  alt="alt text"
                  src={imageUrl}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              )}
            </div>
          );
        })}
      </Fade>
    </div>
  );
}
