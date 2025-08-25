"use client";
import React, { useState } from "react";
import signup from "@public/undraw_sign-up.svg";
// import Image from "next/image";
import { FaEye, FaEyeSlash, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useDispatch,  useSelector } from "react-redux";
import Spinner from "@/components/Spinner";
import { UserService } from "@/services/UserService";
import z from "zod"
import { setLoading } from '@/redux/AuthSlice/AuthSlice'
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
// import "@/app/globals.css"
export default function page() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { loading } = useSelector((store: any) => store.auth)
  const dispatch = useDispatch()
  // validation
  const UserSchema = z.object({
    fullName: z.string().min(3, 'fullName must be atleast 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must contain atleast 8 characters'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword']
  })

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [id]: value
    }))

    console.log(signupData)
  }
  const handleTogglePassword = (id: any) => {
    // console.log(field)
    setShowPassword(prev => (prev === id ? null : id));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    console.log("loading value before submitting", loading);
    dispatch(setLoading(true))
    console.log("submitting the form..", signupData);
    console.log('loading updated value',loading)
    const result = UserSchema.safeParse(signupData);
    const zodErrors: Record<string, string[]> = {};

    if (!result.success) {
      // zod validation
      const errorObj = result.error.format();
      for (const key in errorObj) {
        const err = (errorObj as any)[key];
        if (err?._errors?.length) {
          zodErrors[key] = err._errors;
        }
      }
      setErrors(zodErrors);
      dispatch(setLoading(false))
      return;
    }
    try {
      const res = await UserService.SignupUser(signupData)
      console.log("i am in signup page", res)
      if (res.status !== 201) {
        console.log("technical error")
      }
      
      router.push('/dashboard')
      setSignupData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setLoading(false)
      // redirect('/dashboard')
    } catch (err) {
      console.log('errors: ', err)
    }
    dispatch(setLoading(false))
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Image Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <img
            src={signup.src}
            alt="Login Illustration"
            style={{ width: "75%", height: "auto" }}

          />
        </div>

        {/* Form Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form className="form-width  p-4  rounded  bg-white" onSubmit={handleSubmit}>
            {/* <form className="form-width  p-4  rounded  bg-white" > */}
            {/* <p className="mb-0">Welcome Back!</p> */}
            <h2 className="mb-4 fs-4">Create an account</h2>

            {/* Fullname  */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label fw-semibold">
                Full Name  <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={signupData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
              // required
              />
              {errors?.fullName && <p id="fullNameError" className="form-text text-danger">{errors?.fullName?.[0]}</p>}
            </div>

            {/* Email  */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={signupData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {errors?.email && <p id="emailError" className="form-text text-danger">{errors?.email?.[0]}</p>}
            </div>

            {/* password  */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showPassword === "id1" ? "text" : "password"}
                  className="form-control"
                  id="password"
                  value={signupData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={()=>handleTogglePassword("id1")}
                >
                  {showPassword === "id1" ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors?.password && <p id="passwordError" className="form-text text-danger">{errors?.password?.[0]}</p>}
            </div>

            {/* confirm password  */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showPassword === "id2" ? "text" : "password"}
                  className="form-control"
                  id="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTogglePassword("id2")}
                >
                  {showPassword === "id2" ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {errors?.confirmPassword && <p id="confirmPasswordError" className="form-text text-danger">{errors?.confirmPassword?.[0]}</p>}
            </div>

            {/* submit button */}
            <button type="submit" className="btn btn-primary w-100">
              {loading==true ? <Spinner color="#fff"/> : 'Signup'} 
              {/* signup */}
            </button>

            {/* or */}
            <div className="mt-4">
              <div className="d-flex align-items-center justify-content-center  gap-2">
                <div className="w-50" style={{ height: '1px', backgroundColor: "#dee2e6" }}></div>
                <span>or</span>
                <div className="w-50" style={{ height: '1px', backgroundColor: "#dee2e6" }}></div>
              </div>
            </div>

            {/* oauth */}
            <div className="row g-2 gap-md-3 mt-3">
              <div className="col">
                <button
                  className="btn d-flex align-items-center justify-content-center gap-2 px-3 w-100"
                  style={{ borderColor: "#dee2e6", borderWidth: "1px" }}
                >
                  <FcGoogle size={18} />
                  <span className="fs-6 fw-semibold">Google</span>
                </button>
              </div>

              <div className="col">
                <button
                  className="btn d-flex align-items-center justify-content-center gap-2 px-3 w-100"
                  style={{ borderColor: "#dee2e6", borderWidth: "1px" }}
                >
                  <FaFacebook size={18} color="#0a68ff" />
                  <span className="fs-6 fw-semibold">Facebook</span>
                </button>
              </div>

              <div className="col">
                <button
                  className="btn d-flex align-items-center justify-content-center gap-2 px-3 w-100"
                  style={{ borderColor: "#dee2e6", borderWidth: "1px" }}
                >
                  <FaLinkedin size={18} color="#0074b3" />
                  <span className="fs-6 fw-semibold">Linkedin</span>
                </button>
              </div>
            </div>


            {/* line */}
            {/* <div className="mt-4 mt-lg-5">
              <div className="d-flex align-items-center justify-content-center  gap-2">
                <div className="w-100" style={{ height: '1px', backgroundColor: "#dee2e6" }}></div>
               
              </div>
            </div> */}
            {/* signup*/}
            <div className="text-left mt-3">
              <small>
                Already have an account?{" "}
                <Link href="/auth/login" className="text-decoration-none text-decoration-underline-hover">
                  Sign in
                </Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


