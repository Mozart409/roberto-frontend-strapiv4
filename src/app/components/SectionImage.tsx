import Image from "next/image";
import type * as React from "react";
import CustomLink from "./elements/custom-link";

export interface ISectionImage {
  data: {
    id: number;
    __component: string;
    small_image: boolean;
    image_border: boolean;
    picture: Picture;
  };
}

export interface Picture {
  data: Daum[];
}

export interface Daum {
  id: number;
  attributes: Attributes;
}

export interface Attributes {
  url: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
}

interface ILinkWrapper {
  link: ILink;
  children: React.JSX.Element | React.JSX.Element[];
}

const LinkWrapper: React.FC<ILinkWrapper> = ({ children, link }) => {
  if (link) return <CustomLink link={link}>{children}</CustomLink>;

  return <div>{children}</div>;
};

interface IBorderWrapper {
  image_border: boolean;
  children: React.JSX.Element | React.JSX.Element[];
}

const BorderWrapper: React.FC<IBorderWrapper> = ({
  children,
  image_border,
}) => {
  return (
    <div>
      {image_border
        ? (
          <div className="rounded border-2 border-primary-400 shadow shadow-primary-600">
            {children}
          </div>
        )
        : <div>{children}</div>}
    </div>
  );
};

const SectionImage: React.FC<ISectionImage> = ({ data }) => {
  return (
    <div className="container mx-auto my-0 grid max-w-prose grid-cols-1 justify-items-center sm:my-4 md:my-8 md:max-w-screen-md lg:max-w-screen-lg">
      <BorderWrapper image_border={data.image_border}>
        {data.small_image
          ? (
            <Image
              src={data.picture.data[0].attributes.url}
              alt={data.picture.data[0].attributes.alternativeText || ""}
              title={data.picture.data[0].attributes.caption || ""}
              className="mx-auto w-full object-contain"
              width={333}
              height={250}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          )
          : (
            <Image
              src={data.picture.data[0].attributes.url}
              alt={data.picture.data[0].attributes.alternativeText || ""}
              title={data.picture.data[0].attributes.caption || ""}
              className="mx-auto w-full object-contain"
              width={500}
              height={375}
            />
          )}
      </BorderWrapper>
    </div>
  );
};

export default SectionImage;
