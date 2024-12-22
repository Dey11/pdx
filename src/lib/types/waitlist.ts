export type WaitlistFormData = {
  email: string;
  name: string;
};

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: {
    [key in keyof WaitlistFormData]?: string[];
  };
  data?: WaitlistFormData;
};
