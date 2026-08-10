import { getImageProps } from "next/image";

export function getNextImageUrl(src: string, width: number, quality = 75) {
  return getImageProps({
    src,
    alt: "",
    width,
    height: 0,
    quality,
    loading: "eager",
  }).props;
}
