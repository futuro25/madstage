import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import Button from "./common/Button";
import {EyeIcon} from './icons'
import { useForm } from "react-hook-form";
import * as utils from '../utils/utils'
import logo2 from '../../src/logo2.png'

export default function ForgotPassword() {
  const API_USERS_URL = '/api/users/forgot-password';
  const [userReset, setUserReset] = useState();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    const body = {
      email: formData.email.toLowerCase(),
    }

    try {
      const userReset = await utils.postRequest(API_USERS_URL, body);

      setUserReset(userReset)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col w-screen h-screen text-white bg-black-madstage">
      <div className="flex h-[calc(100vh-4rem)]">
        <main className="flex-1">
          <div className="h-full overflow-auto mt-4">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center p-4 rounded w-[400px] ">
                <img src={logo2} className="w-40 -mt-10 mb-8" />
                {
                  userReset ? (
                    <h1 className="rounded p-4 text-white inline-block text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ">Password updated</h1>
                  ) : (
                    <h1 className="rounded p-4 text-white inline-block text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ">Forgot password</h1>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col'>
                    {
                      !userReset && (
                        <>
                        <input type="text" autoComplete="off" placeholder="Email" {...register("email", { required: true })} className="mt-2 rounded border border-gray-900  p-4 pl-8 text-gray-900 " />
                        {errors.email && <span className='px-2 text-red-500'>* Obligatorio</span>}
                        <Button className="mt-2">Reset password</Button>
                        </>
                    )}
                  </form>
                  
                  {
                    !userReset && (
                      <Button className="mt-2 f-full" variant="outline" onClick={() => navigate("/login")}>Login</Button>
                    )}

                    {
                      userReset?.data?.error && (
                      <>
                      <p className="text-red-500">{userReset.data.error}</p>
                      <Button className="mt-2 f-full" variant="outline" onClick={() => navigate(0)}>Try again</Button>
                      </>)
                    }

                    {
                      userReset && (
                        <>
                          <p className="text-white px-6 text-center">Yuor password was reseted plese check your email account.</p>
                          <Button className="mt-4 w-full" onClick={() => navigate("/login")}>Login</Button>
                        </>
                      )
                    }
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
