import { useNavigate } from "react-router-dom";
import React, {useState} from "react";
import Button from "./common/Button";
import {EyeIcon} from './icons'
import { useForm } from "react-hook-form";
import * as utils from '../utils/utils'
import logo2 from '../../src/logo2.png'

export default function Login() {
  const API_URL = '/api/users/login';
  const API_USERS_URL = '/api/users';
  const [errorLogin, setErrorLogin] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    const body = {
      email: formData.email.toLowerCase(),
      password: formData.password
    }

    try {
      const userLogin = await utils.postRequest(API_URL, body);
      const userId = userLogin.data._id;
      await utils.patchRequest(`${API_USERS_URL}/${userId}`, {lastlogin: new Date()});
      
      sessionStorage.userId = userLogin.data._id;
      sessionStorage.name = userLogin.data.name;
      sessionStorage.lastName = userLogin.data.lastName;
      sessionStorage.email = userLogin.data.email;
      sessionStorage.type = userLogin.data.type;
      navigate("/home");
      
    } catch (error) {
      console.log(error)
      setErrorLogin('Usuario o Clave erroneos')
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
                <h1 className="rounded p-4 text-white inline-block text-2xl sm:text-3xl font-extrabold text-white tracking-tight ">LOGIN</h1>

                <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col'>
                  <input type="text" {...register("email", { required: true })} className="mt-2 rounded border border-slate-200  p-4 pl-8 text-slate-500 " />
                  {errors.email && <span className='px-2 text-red-500'>* Obligatorio</span>}
                  <div className="flex">
                    <input type={isPasswordVisible ? "text" : "password"} {...register("password", { required: true })} className="mt-2 w-full rounded border border-slate-200  p-4 pl-8 text-slate-500 " />
                    <div className="relative mt-8 -ml-5 right-2.5	text-gray-900 cursor-pointer" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                      <EyeIcon className="w-4 h-4" />
                    </div>
                  </div>
                  {errors.password && <span className='px-2 text-red-500'>* Obligatorio</span>}
                  <Button className="mt-2">Login</Button>
                  {errorLogin && <span className='p-2 text-red-500'>{errorLogin}</span>}
                </form>
                <Button className="mt-2" variant="outline" onClick={() => navigate("/create-account")}>Create account</Button>
                <Button className="" variant="outline" onClick={() => navigate("/forgot-password")}>Forgot password?</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
