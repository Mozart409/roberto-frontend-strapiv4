import type { FC, ReactNode } from "react";

export const ColorWrapper: FC<{
  children: ReactNode;
  title_color: "black" | "orange" | "green" | "yellow" | "blue" | "red";
}> = ({ children, title_color }) => {
  switch (title_color) {
    case "black":
      return (
        <span className="prose prose-lg prose-headings:text-black xl:prose-2xl">
          {children}
        </span>
      );
    case "orange":
      return (
        <span className="prose prose-lg prose-headings:text-orange-500 xl:prose-2xl">
          {children}
        </span>
      );
    case "green":
      return (
        <span className="prose prose-lg prose-headings:text-green-500 xl:prose-2xl">
          {children}
        </span>
      );
    case "yellow":
      return (
        <span className="prose prose-lg prose-headings:text-yellow-500 xl:prose-2xl">
          {children}
        </span>
      );
    case "blue":
      return (
        <span className="prose prose-lg prose-headings:text-blue-500 xl:prose-2xl">
          {children}
        </span>
      );
    case "red":
      return (
        <span className="prose prose-lg prose-headings:text-red-500 xl:prose-2xl">
          {children}
        </span>
      );
    default:
      return (
        <span className="prose prose-lg prose-headings:text-black xl:prose-2xl">
          {children}
        </span>
      );
  }
};

export const HeadingWrapper: FC<{
  children: ReactNode;
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}> = ({ children, type }) => {
  switch (type) {
    case "h1":
      return <h1>{children}</h1>;
    case "h2":
      return <h2>{children}</h2>;
    case "h3":
      return <h3>{children}</h3>;
    case "h4":
      return <h4>{children}</h4>;
    case "h5":
      return <h5>{children}</h5>;
    case "h6":
      return <h6>{children}</h6>;
    default:
      return <h6>{children}</h6>;
  }
};
