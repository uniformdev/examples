import { FC } from "react";
import { Asset } from "@uniformdev/assets";
import { ComponentProps } from "@uniformdev/canvas-next-rsc/component";
import BaseImage from "@/components/ui/Image";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { ViewPort } from "@/utils/types";
import { resolveAsset } from "@/utils";
import { ResolveComponentResultWithType } from "@/uniform/models";

export type ImageParameters = {
  image?: Asset[];
  width?: number;
  height?: number;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  overlayColor?: string;
  overlayOpacity?: string;
  border?: string | ViewPort<string>;
  priority?: boolean;
  unoptimized?: boolean;
};

type ImageProps = ComponentProps<ImageParameters>;

const Image: FC<ImageProps> = ({
  image,
  objectFit,
  width,
  height,
  overlayColor,
  overlayOpacity,
  border,
  priority,
  unoptimized,
  context,
  component,
}) => {
  const [resolvedImage] = resolveAsset(image);

  if (!resolvedImage) {
    const isEditorPreviewMode = context.previewMode === "editor";
    const isPlaceholder = component?._id?.includes("placeholder_");

    if (!isEditorPreviewMode || isPlaceholder) {
      return null;
    }

    return (
      <div
        style={{
          width: width ? `${width}px` : "auto",
          height: height ? `${height}px` : "auto",
        }}
      >
        <MediaPlaceholder
          type="image"
          placeholder="Please add an asset to display an image"
        />
      </div>
    );
  }

  const { url, title = "" } = resolvedImage;

  return (
    <BaseImage
      containerStyle={{
        ...(width ? { width: `${width}px` } : {}),
        ...(height ? { height: `${height}px` } : {}),
      }}
      src={url}
      alt={title}
      fill
      unoptimized={unoptimized}
      priority={priority}
      sizes="100%"
      style={{ objectFit }}
      overlayColor={overlayColor}
      overlayOpacity={overlayOpacity}
      border={border}
    />
  );
};

export const imageMapping: ResolveComponentResultWithType = {
  type: "image",
  component: Image,
};

export default Image;
