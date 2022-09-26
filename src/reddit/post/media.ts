interface RawImageMetadata {
  x: number;
  y: number;
  u: string;
}

interface RawMediaMetadataItem {
  id: string;
  /**
   * Status of this media item
   */
  status: string;
  /**
   * The media type
   */
  e: string;
  /**
   * MIME Type, e.g. `image/jpg`
   */
  m: string;
  /**
   * Thumbnails
   */
  p: RawImageMetadata[];
  /**
   * Original suurce image
   */
  s: RawImageMetadata;
}

export type RawMediaMetadata = Record<string, RawMediaMetadataItem>;

/**
 * Metadata for a single image variant.
 */
export interface ImageMetadata {
  /** The width of this image variant */
  width: number;
  /** The height of this image variant */
  height: number;
  /** The full URL of this image variant */
  url: string;
}

export type MediaMetadataItemStatus = "valid";
export type MediaMetadataItemType = "Image";

/**
 * Metadata for a media item of a post.
 */
export interface MediaMetadataItem {
  /**
   * The unique id of this media item.
   */
  id: string;
  /**
   * Status of this media item
   */
  status: MediaMetadataItemStatus;
  /**
   * The media type
   */
  type: MediaMetadataItemType;
  /**
   * MIME Type, e.g. `image/jpg`
   */
  mimeType: string;
  /**
   * Alternative preview resolutions of the original `source` image.
   */
  previews: ImageMetadata[];
  /**
   * Original suurce image
   */
  source: ImageMetadata;
}

/**
 * Metadata for all media items attached to this post.
 */
export type MediaMetadata = Record<string, MediaMetadataItem>;

/**
 * Converts the raw media metadata object returned from Reddit into a more user friendly
 * object with more descriptive object keys.
 *
 * @param rawMediaMetadata The raw media metadata object returned from Reddit
 */
export function convertMediaMetadata(
  rawMediaMetadata?: unknown
): MediaMetadata | undefined {
  if (!isRawMediaMetadata(rawMediaMetadata)) {
    return;
  }

  const mediaMetadata: MediaMetadata = {};
  for (const id of Object.keys(rawMediaMetadata)) {
    const { status, e, m, p, s } = rawMediaMetadata[id];
    mediaMetadata[id] = {
      id,
      status: status as MediaMetadataItemStatus,
      type: e as MediaMetadataItemType,
      mimeType: m,
      previews: p.map(value => convertImageMetadata(value)),
      source: convertImageMetadata(s),
    };
  }

  return mediaMetadata;
}

function convertImageMetadata(input: RawImageMetadata) {
  return {
    url: input.u,
    width: input.x,
    height: input.y,
  };
}

function isRawMediaMetadata(value: unknown): value is RawMediaMetadata {
  return typeof value === "object";
}
