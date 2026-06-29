
const LoginError = ({ value }: { value: string }) => {
  return (
    <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 border border-red-500/20 animate-in fade-in slide-in-from-top-1">
      {value}
    </p>
  );
};

export default LoginError;
