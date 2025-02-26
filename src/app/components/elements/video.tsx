import { getStrapiMedia } from "@/app/utils/api-helpers";

interface VideoProps {
  media: IMedia;
  poster?: IMedia;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
}

const Video = ({
  media,
  poster,
  className,
  controls = true,
  autoPlay = false,
}: VideoProps) => {
  const fullVideoUrl = getStrapiMedia(media?.data.attributes.url);
  const fullPosterUrl = getStrapiMedia(poster?.data.attributes.url || "");

  if (!fullVideoUrl) {
    return <div>no media</div>;
  }

  if (fullPosterUrl === "") {
    return (
      // biome-ignore lint/a11y/useMediaCaption: <explanation>
      <video
        className={className}
        poster={fullPosterUrl}
        controls={controls}
        autoPlay={autoPlay}
      >
        <source src={fullVideoUrl} type={media?.data.attributes.mime} />
      </video>
    );
  }

  if (fullPosterUrl !== "" && fullVideoUrl !== "") {
    return (
      // biome-ignore lint/a11y/useMediaCaption: <explanation>
      <video
        className={className}
        poster={fullPosterUrl || undefined} // Ensure poster is of type string
        controls={controls}
        autoPlay={autoPlay}
      >
        <source src={fullVideoUrl} type={media?.data.attributes.mime} />
      </video>
    );
  }

  return <div>no media</div>;
};

export default Video;
