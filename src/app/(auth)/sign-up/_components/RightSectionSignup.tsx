const RightSectionSignup = () => {
  return (
    <div className="relative hidden md:flex flex-col items-center justify-center p-12 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Join Our Community</h2>
        <p className="text-muted-foreground text-sm">
          Connect with people around the world. Share your thoughts, ideas, and
          experiences.
        </p>
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary">10k+</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary">500+</p>
            <p className="text-xs text-muted-foreground">Posts Daily</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-primary">24/7</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSectionSignup;
