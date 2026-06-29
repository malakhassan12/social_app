import SignupForm from "./_components/SignupForm";
import "../FormStyles.css";

const Signup = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
