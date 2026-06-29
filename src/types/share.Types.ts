export type ShareResponse = {
  success: boolean;
  shared: boolean;
  errors?: { message: string };
};

export type Share = {
  id: string;
};
