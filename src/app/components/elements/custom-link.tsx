import Link from "next/link";
import React, { type JSX } from "react";

interface IProps {
  link: ILink;
  children: JSX.Element | JSX.Element[];
}
const CustomLink = ({ link, children }: IProps) => {
  if (typeof link.url === "string") {
    const isInternalLink = link?.url?.startsWith("/");
    if (isInternalLink) {
      // For internal links, use the Next.js Link component
      return (
        <Link href="/[[...slug]]" as={link?.url}>
          <span className="text-gray-700 hover:bg-gray-200">{children}</span>
        </Link>
      );
    }
  }

  // Plain <a> tags for external links
  if (link.newTab) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <a href={link.url} target="_self">
      {children}
    </a>
  );
};

export default CustomLink;
