// utils/commentValidation.ts

export type CommentErrors = {
  content?: string;
  postId?: string;
  message?: string;
};

export function validateCreateComment(
  postId: string,
  content: string,
  errors: CommentErrors,
) {
  if (!postId) {
    errors.postId = "Post id is required";
  }

  if (!content || content.trim().length === 0) {
    errors.content = "Comment cannot be empty";
  }

  if (content.length > 500) {
    errors.content = "Comment must be less than 500 characters";
  }

  return errors;
}
