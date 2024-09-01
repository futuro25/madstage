import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import Button from "./common/Button";
import {EyeIcon} from './icons'
import { Controller, useForm } from "react-hook-form";
import * as utils from '../utils/utils'
import logo2 from '../../src/logo2.png'

export default function Login() {
  const API_USERS_URL = '/api/users';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [account, setAccount] = useState(false);
  const [usernameExist, setUsernameExist] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onChange = async (e) => {
    const username = e.target.value;
    const existUsername = await utils.getRequest(API_USERS_URL + '/username/' + username);
    if (existUsername.data !== null) {
      setUsernameExist(true);
    }else{
      setUsernameExist(false);
    }
  }

  const onSubmit = async (formData) => {
    if (!usernameExist) {
      const body = {
        username: formData.username,
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        type: formData.type,
      }

      try {
        const userAccount = await utils.postRequest(API_USERS_URL, body);
        setAccount(userAccount)
      } catch (error) {
        console.log(error)
      }
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
                  account ? (
                    <h1 className="rounded p-4 text-white inline-block text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ">Account created</h1>
                  ) : (
                    <h1 className="rounded p-4 text-white inline-block text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight ">Create an Account</h1>
                  )}

                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col'>
                  {
                    !account && (
                      <>
                        <input type="text" {...register('username', {onChange: (e) => onChange(e)})} className="mt-2 rounded border border-gray-900  p-4 pl-8 text-gray-900" />
                        {errors.username && <span className='px-2 text-red-500'>* Obligatorio</span>}
                        {usernameExist && <span className='px-2 text-red-500'>* Username already exist</span>}

                        <input type="text" autocomplete="off" placeholder="Name" {...register("name", { required: true })} className="mt-2 rounded border border-gray-900  p-4 pl-8 text-gray-900 " />
                        {errors.name && <span className='px-2 text-red-500'>* Obligatorio</span>}

                        <input type="text" autocomplete="off" placeholder="Last Name" {...register("lastName", { required: true })} className="mt-2 rounded border border-gray-900  p-4 pl-8 text-gray-900 " />
                        {errors.lastName && <span className='px-2 text-red-500'>* Obligatorio</span>}

                        <input type="text" autocomplete="off" placeholder="Email" {...register("email", { required: true })} className="mt-2 rounded border border-gray-900  p-4 pl-8 text-gray-900 " />
                        {errors.email && <span className='px-2 text-red-500'>* Obligatorio</span>}

                        <div className="flex">
                          <select {...register("type", { required: true })} className="rounded h-[58px] w-full mt-2 border pl-7 border-gray-900 p-4 text-gray-900">
                            <option value="">Select profile</option>
                            <option value="SPONSOR">SPONSOR</option>
                            <option value="FAN">FAN</option>
                            <option value="MAD">MAD</option>
                          </select>

                        </div>
                        {errors.type && <span className='px-2 text-red-500'>* Obligatorio</span>}

                        <div className="flex">
                          <input placeholder="Password" autocomplete="off" type={isPasswordVisible ? "text" : "password"} {...register("password", { required: true })} className="mt-2 w-full rounded border border-gray-900  p-4 pl-8 text-gray-900 " />
                          <div className="relative mt-8 -ml-5 right-2.5	text-gray-900 cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <EyeIcon className="w-4 h-4" />
                          </div>
                        </div>
                        {errors.password && <span className='px-2 text-red-500'>* Obligatorio</span>}
                      </>
                    )
                  }
                  {
                    account ? (
                      <div className="flex w-full items-center justify-center mt-2 h-[40px]">Please go to<a href="./login" className="font-bold mx-2">Login</a> page</div>
                    ) : (
                      <Button className="mt-2">Create account</Button>
                    )
                  }
                </form>
                {
                    !account && (
                <Button className="mt-2 f-full" variant="outline" onClick={() => navigate("/login")}>Login</Button>
                    )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
