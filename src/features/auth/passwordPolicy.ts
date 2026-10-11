export const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", isMet: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", isMet: (value: string) => /[A-Z]/.test(value) },
  { label: "One number", isMet: (value: string) => /[0-9]/.test(value) },
  {
    label: "One special character (such as ! or #)",
    isMet: (value: string) => /[^A-Za-z0-9\s]/.test(value),
  },
] as const;

export const PASSWORD_POLICY_MESSAGE =
  "Use at least 8 characters, including one uppercase letter, one number, and one special character (such as ! or #).";

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((requirement) =>
    requirement.isMet(password),
  );
}