"use client";
import React, { useState } from "react";
import login from "@public/undraw_sign-in.svg";
import { FaEye, FaEyeSlash, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setLoading } from "@/redux/AuthSlice/AuthSlice";
import { UserService } from "@/services/UserService";
import z from 'zod'


export default function page() {
  const router = useRouter();
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({email: '',password: ''})
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { loading } = useSelector((store: any) => store.auth)
  const [generalErrors, setGeneralErrors] = useState<string | null>(null)
  const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must contain atleast 8 characters')
  })


  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [id]: value
    }))
    setGeneralErrors(null)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    dispatch(setLoading(true))
        const result = LoginSchema.safeParse(loginData);
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
            const res = await UserService.LoginUser(loginData)
            if (res.status !== 200) {
              console.log("technical error")
              
            }
            router.push('/dashboard')
            // setLoading(false)
            
          } catch (err:any) {
            console.log('errors: ', err)
            setGeneralErrors(err.response.data.error)
          }
          setLoginData({email: '',password: ''});
          dispatch(setLoading(false))
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Image Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <img
            src={login.src}
            alt="Login Illustration"
            style={{ width: "75%", height: "auto" }}

          />
        </div>

        {/* Form Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form className="form-width  p-4  rounded  bg-white" onSubmit={handleSubmit}>
              <p className="mb-0">Welcome Back!</p>
              <h2 className="mb-4 fs-4">Login to your account</h2>

              {/* Email  */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  required
                  value={loginData.email}
                  onChange={handleChange}
                />
                {errors?.email && <p id="loginemailError" className="form-text text-danger">{errors?.email?.[0]}</p>}
              </div>

              {/* password  */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={loginData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {errors?.password && <p id="loginPasswordError" className="form-text text-danger">{errors?.password?.[0]}</p>}
              </div>

              {/* submit button */}
              <button type="submit" className="btn btn-primary w-100">
                {loading == true ? <Spinner color="#fff" /> : "login"}
              </button>
              {generalErrors && <p className="form-text text-danger">{generalErrors}</p>}
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
              <div className="mt-4 mt-lg-5">
                <div className="d-flex align-items-center justify-content-center  gap-2">
                  <div className="w-100" style={{ height: '1px', backgroundColor: "#dee2e6" }}></div>

                </div>
              </div>
              {/* signup*/}
              <div className="text-left mt-3">
                <small>
                  Don’t have an account?{" "}
                  <Link href="/auth/signup" className="text-decoration-none text-decoration-underline-hover">
                    Sign up
                  </Link>
                </small>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
