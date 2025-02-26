import Image from "next/image";
import Link from "next/link";
import { renderButtonStyle } from "../utils/render-button-style";
import HighlightedText from "./HighlightedText";

export default function LangRedirect() {
  return (
    <section className="dark:text-gray-100 dark:bg-black">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:flex-row lg:justify-between lg:py-24">
        <div className="flex flex-col justify-center p-6 text-center rounded-lg lg:max-w-md lg:text-left xl:max-w-lg">
          <HighlightedText
            text="There is no content available in your language."
            tag="h1"
            className="mb-8 text-5xl font-bold leading-none sm:text-4xl"
            color="dark:text-violet-400"
          />
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:items-center sm:space-y-0 sm:space-x-4 lg:justify-start">
            <Link href="/en" className={renderButtonStyle("primary")}>
              Back To English
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center p-6 mt-8 h-72 sm:h-80 lg:mt-0 lg:h-96 xl:h-112 2xl:h-128">
          <Image
            src="https://images.pexels.com/photos/409701/pexels-photo-409701.jpeg"
            alt="city view"
            className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
            width={600}
            height={600}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </section>
  );
}
