export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthNavigationState {
  isSignup?: boolean;
  returnToSignup?: boolean;
  termsAccepted?: boolean;
  formData?: SignupFormData;
}