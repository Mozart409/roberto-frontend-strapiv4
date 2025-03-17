import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { getStrapiMedia } from "../utils/api-helpers";
import GradientHeroRenderer from "../utils/GradientHeroRenderer";
import MarkdownRenderer from "../utils/MarkdownRenderer";

interface GradientHero {
  data: {
    component: string;
    id: number;
    title: string;
    blackText: string;
    coloredText: string;
    content: string;
    title_color: "black" | "orange" | "green" | "yellow" | "blue" | "red";
    seminarCard: SeminarCard[];
  };
}

interface Attributes {
  url: string;
  alternativeText?: any;
  caption?: any;
  width: number;
  height: number;
}

interface Data {
  id: number;
  attributes: Attributes;
}

interface Image {
  data: Data;
}

interface SeminarCard {
  id: number;
  tilte: string;
  text: string;
  category: string;
  url: string;
  newTab: boolean;
  image: Image;
}

const SingleCard = ({
  category,
  id,
  image,
  newTab,
  text,
  tilte,
  url,
}: SeminarCard) => {
  let imageUrl = null;

  if (image?.data?.attributes?.url) {
    imageUrl = getStrapiMedia(image.data.attributes.url);
  }

  return (
    <div
      key={id}
      className="flex overflow-y-auto flex-col h-full rounded-lg shadow-lg"
    >
      <Link
        href={url}
        target={newTab ? "_blank" : "_self"}
        rel={newTab ? "noopener noreferrer" : ""}
        title={tilte}
      >
        <div className="relative flex-shrink-0">
          {imageUrl ? (
            <Image
              className="object-cover w-full h-96"
              src={imageUrl}
              width={1000}
              height={700}
              alt={
                image.data.attributes.alternativeText ||
                image.data.attributes.caption ||
                ""
              }
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          ) : null}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="flex flex-col flex-1 justify-between py-2 px-6 mx-auto bg-white">
              <div className="flex-1">
                <p className="text-2xl font-bold text-left text-amber-900">
                  {category}
                </p>
                <div className="flex mt-2 justify-left">
                  <MarkdownRenderer text={text} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

function GradientHero({ data }: GradientHero): ReactElement<any> {
  return (
    <div>
      <div className="relative mx-auto max-w-5xl">
        <div className="relative mx-auto rounded">
          <div className="absolute inset-0 z-0 max-w-7xl h-[85vh]">
            <div className="cssgradient h-[85vh] lg:h-[75vh] xl:h-[65vh] 2xl:h-[85vh]"></div>
          </div>
          <div className="relative m-8">
            <div className="absolute inset-0">
              <div className="h-1/3 sm:h-2/3"></div>
            </div>
            <div className="relative mx-auto max-w-7xl">
              <div className="pt-8 text-center">
                <GradientHeroRenderer text={data.content} />
              </div>

              <div className="grid grid-cols-1 gap-3 mx-auto mt-12 max-w-lg lg:grid-cols-1 lg:max-w-none">
                {data.seminarCard.map((node) => (
                  <SingleCard key={node.id} {...node} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradientHero;
