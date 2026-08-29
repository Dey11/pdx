import { SignInForm } from "@/components/auth/sign-in-form";
import { getAuthCapabilities } from "@/lib/auth-capabilities";

export const dynamic = "force-dynamic";

const SignInPage = () => {
  const capabilities = getAuthCapabilities();

  return (
    <SignInForm
      githubEnabled={capabilities.github}
      googleEnabled={capabilities.google}
      passwordResetEnabled={capabilities.passwordReset}
    />
  );
};

export default SignInPage;
