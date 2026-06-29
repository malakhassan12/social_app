import { FormState } from "@/types/form.Types";

const validateCreatePost = (
  desc: string,
  images: File[],
  videos: File[],
  errors: FormState["errors"] = {},
) => {
  // Description validation

  if (!desc || desc.trim().length === 0) {
    errors.message = "Post description is required";
  }

  if (desc && desc.length > 280) {
    errors.message = "Description must be less than 280 characters";
  }

  // Files validation

  const MAX_IMAGES = 10;
  const MAX_VIDEOS = 5;

  if (images.length > MAX_IMAGES) {
    errors.message = `You can upload maximum ${MAX_IMAGES} images`;
  }

  if (videos.length > MAX_VIDEOS) {
    errors.message = `You can upload maximum ${MAX_VIDEOS} videos`;
  }

  // Image validation

  for (const image of images) {
    if (!image.type.startsWith("image/")) {
      errors.message = "Invalid image file";
    }

    if (image.size > 5 * 1024 * 1024) {
      errors.message = "Image size must be less than 5MB";
    }
  }

  // Video validation

  for (const video of videos) {
    if (!video.type.startsWith("video/")) {
      errors.message = "Invalid video file";
    }

    if (video.size > 50 * 1024 * 1024) {
      errors.message = "Video size must be less than 50MB";
    }
  }
};

export { validateCreatePost };
