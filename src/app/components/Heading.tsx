import type { FC } from "react";
import { ColorWrapper, HeadingWrapper } from "../utils/render-title-style";

interface Props {
  data: {
    __component: string;
    id: number;
    heading: string;
    description: string;
    title_color: "black" | "orange" | "green" | "yellow" | "blue" | "red";
    title_type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  };
}

const Heading: FC<Props> = ({ data }) => {
  return (
    <div className="container py-4 mx-auto space-y-2 text-center">
      <ColorWrapper key={data.id} title_color={data.title_color}>
        <HeadingWrapper type={data.title_type}>{data.heading}</HeadingWrapper>
        <p>{data.description}</p>
      </ColorWrapper>
    </div>
  );
};

export default Heading;
