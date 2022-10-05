interface RawImageMetadata {
  x: number;
  y: number;
  u: string;
}

interface FailedRawMediaMetadataItem {
  status: "failed";
}

interface ValidRawMediaMetadataItem {
  id: string;
  /**
   * Status of this media item
   */
  status: "valid";
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

type RawMediaMetadataItem =
  | FailedRawMediaMetadataItem
  | ValidRawMediaMetadataItem;

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

/**
 * Possible `status` values for a media metadata item.
 */
export type MediaMetadataItemStatus = "valid" | "failed";

/**
 * Possible `type` values for a media metadata item.
 */
export type MediaMetadataItemType = "Image";

/**
 * Metadata for media items of a post that could not be processed.
 *
 * Only has a status of `failed` and no other properties.
 */
export interface FailedMediaMetadataItem {
  /**
   * Status of this media item
   */
  status: "failed";
}

/**
 * Metadata for a media item of a post that was successfully processed.
 */
export interface ValidMediaMetadataItem {
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
 * Metadata for a media item of a post.
 */
export type MediaMetadataItem =
  | FailedMediaMetadataItem
  | ValidMediaMetadataItem;

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
    const item = rawMediaMetadata[id];
    if (item.status === "failed") {
      mediaMetadata[id] = item;
    } else if (item.status === "valid") {
      const { status, e, m, p, s } = item;
      mediaMetadata[id] = {
        id,
        status,
        type: e as MediaMetadataItemType,
        mimeType: m,
        previews: p.map(value => convertImageMetadata(value)),
        source: convertImageMetadata(s),
      };
    }
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
