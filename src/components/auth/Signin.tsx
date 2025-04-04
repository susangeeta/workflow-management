import { google } from "@/assets/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/db/db.config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";

const SignIn = () => {
  const [error, setError] = useState<string>("");

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google login successful!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-md"
      >
        <img src={google} alt="Google" className="h-5 w-5" />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};

export default SignIn;
