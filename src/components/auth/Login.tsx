/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/db/db.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useState } from "react";
import Swal from "sweetalert2";

import { apple, bgImage, facebook, google } from "@/assets/auth";
import { mainLogo } from "@/assets/logos";
import { useDb } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."
  }),
  rememberMe: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [error, setError] = useState<string>("");
  const [isRegister, setIsRegister] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useDb();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const handleAuth = async (values: FormValues) => {
    setAuthLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        Swal.fire(
          "Success!",
          "Registration successful! You can now log in.",
          "success"
        );
        setIsRegister(false); // Switch to login
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        Swal.fire("Success!", "Login successful!", "success");
        navigate("/portal/workflows");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setAuthLoading(false);
  };

  return (
    <div className="h-full overflow-hidden  flex items-center justify-center">
      <div
        className="flex h-full w-full bg-cover bg-center bg-no-repeat bg-black/60 bg-blend-overlay "
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className=" flex items-center justify-center w-full h-full">
          <div className="w-4/5 max-w-6xl flex">
            <div className="w-1/2 flex flex-col justify-center items-start gap-30">
              <div className="">
                <img
                  src={mainLogo}
                  alt="HighBridge Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>

              <div className="flex flex-col gap-5">
                <h1 className="text-white text-6xxl font-bold ">
                  Building the Future...
                </h1>
                <p className="text-gray-300 font-normal  text-base  leading-[28.16px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing <br />
                  elit, sed do eiusmod tempor incididunt ut labore et <br />
                  dolore magna aliqua.
                </p>
              </div>
            </div>

            <div className="w-1/2 flex items-center justify-center pt-[11rem]">
              <div className="bg-[#FAFAFA] rounded-3xl shadow-lg p-9 w-[450px] ">
                <p className="text-sm font-medium text-black mb-1">
                  WELCOME BACK!
                </p>
                <h2 className="text-2xl text-black font-semibold mb-6">
                  {isRegister
                    ? "SignUp to your Account"
                    : "Log In to your Account"}
                </h2>

                {error && (
                  <p className="text-red-500 text-sm text-center mb-4">
                    {error}
                  </p>
                )}

                <form
                  onSubmit={form.handleSubmit(handleAuth)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-normal text-[#4F4F4F]">
                      Email
                    </label>
                    <input
                      {...form.register("email")}
                      placeholder="Type here..."
                      className="w-full px-3 py-2 border bg-white border-[#E0E0E0] rounded-md focus:outline-none "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-normal text-[#4F4F4F]">
                      Password
                    </label>
                    <input
                      {...form.register("password")}
                      type="password"
                      placeholder="Type here..."
                      className="w-full px-3 py-2 border bg-white border-[#E0E0E0] rounded-md focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative inline-block h-5 w-5 mr-1">
                        <input
                          type="checkbox"
                          className="opacity-0 absolute h-0 w-0"
                          {...form.register("rememberMe")}
                        />
                        <div
                          className={`h-5 w-5 border ${
                            form.watch("rememberMe")
                              ? "bg-red-500 border-red-500"
                              : "border-gray-300"
                          } rounded flex items-center justify-center`}
                        >
                          {form.watch("rememberMe") && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <label className="text-xs font-normal text-black">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-xs text-gray-600 font-medium">
                      Forgot Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="bg-red-500 cursor-pointer text-white py-3 rounded-md font-bold text-base"
                  >
                    {authLoading
                      ? "Loading..."
                      : isRegister
                        ? "Sign Up"
                        : "Log In"}
                  </button>
                  <div className="flex gap-4 items-center  ">
                    <div className="w-40 h-[1px] bg-[#E0E0E0]"></div>
                    <div className="text-center text-sm text-gray-500">
                      or
                    </div>{" "}
                    <div className="w-40 h-[1px] bg-[#E0E0E0]"></div>
                  </div>
                  {/* Social Login Options */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={async () => {
                        await signInWithGoogle();
                        navigate("/portal/workflows");
                      }}
                      className="flex items-start cursor-pointer justify-start gap-20 py-4 px-4 border-2 border-gray-200 rounded-md"
                    >
                      <img src={google} alt="Google" className="h-5 w-5 ml-6" />
                      <span className="text-sm text-medium font-normal">
                        {"Log In with Google"}
                      </span>
                    </button>

                    <button className="flex items-start cursor-pointer justify-start gap-20 py-4 px-4 border-2 border-gray-200 rounded-md">
                      <img
                        src={facebook}
                        alt="Facebook"
                        className="h-5 w-5 ml-6"
                      />
                      <span className="text-sm text-medium font-normal">
                        Log In with Facebook
                      </span>
                    </button>

                    <button className="items-start cursor-pointer justify-start flex gap-20 py-4 px-4 border-2 border-gray-200 rounded-md">
                      <img src={apple} alt="Apple" className="h-5 w-5 ml-6" />
                      <span className="text-sm text-medium font-normal">
                        Log In with Apple
                      </span>
                    </button>
                  </div>
                  <div className="text-center text-sm mt-4">
                    {isRegister ? "Already have an account?" : "New User?"}{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsRegister(!isRegister);
                      }}
                      className="text-black underline font-bold"
                    >
                      {isRegister ? "LOG IN HERE" : "SIGN UP HERE"}
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
