import { useNavigate } from 'react-router'
import Ranking from "./common/Ranking";
import Button from "./common/Button";
import AvatarThumb from "./common/AvatarThumb";
import React, {useState, useEffect, useRef} from "react";
import { useForm } from "react-hook-form";
import useSWR from 'swr'
import {useSWRConfig} from 'swr'
import {ClipLoader} from 'react-spinners'
import Header from "./common/Header";
import * as utils from '../utils/utils'
import LoadingState from './common/LoadingState';

export default function Settings() {

  const userId = sessionStorage.userId;
  const API_URL = '/api/users';
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { data, error, isLoading, isValidating } = useSWR(API_URL + "/" + userId, (url) => fetch(url).then(res => res.json()))
  const [user, setUser] = useState({});
  const [userImage, setUserImage] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const { mutate } = useSWRConfig()
  const refFile = useRef(null)
  const refFormImage = useRef(null)
  const navigate = useNavigate()

  const onEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingMode(true)
  }

  const onCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingMode(false)
    reset()
  }

  const onChange = async (e) => {
    setIsLoadingImage(true)
    if (e.target?.files.length) {
      const tempFile = e.target?.files[0];
      const resource = await utils.uploadFile(tempFile);
      const userUpdated = await mutate(API_URL, utils.patchRequest(`${API_URL}/${sessionStorage.userId}`, {pictureUrl: resource.secure_url}), {optimisticData: true})
      setUserImage(userUpdated.data.pictureUrl)
      setUser(userUpdated.data)
      navigate(0)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoadingSubmit(true)
      const userUpdated = await mutate(API_URL, utils.patchRequest(`${API_URL}/${sessionStorage.userId}`, data), {optimisticData: true})
      console.log(userUpdated)
      setUser(userUpdated.data)
      
      setIsLoadingSubmit(false)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setUser(data);
    setUserImage(data?.pictureUrl);
  }, [data, setUserImage, userImage])

  useEffect(() => {
    setUser(data);
    setUserImage(data?.pictureUrl);
  }, [])

  return (
    <div className="px-4 h-full overflow-auto mt-0">
      <Header string="Settings" />

      {
        user?._id ? (
          <>
            <div className="flex flex-col">  
              <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden ">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] " style={{"backgroundPosition": "10px 10px"}}></div>
                <div className="relative rounded-xl overflow-auto">
                  <div className="shadow-sm overflow-hidden my-8">
                  <form className='w-full flex flex-col' id="imageForm" ref={refFormImage}>
                      <table className="border-collapse table-fixed w-full text-sm bg-white">
                        <tbody>
                          {/* ================ */}
                          <tr>
                            <td>
                              <div className="p-4 gap-4 flex flex-col items-start">
                                {
                                  isLoadingImage && (
                                    <div className='absolute px-2 w-[100px] h-[100px] bg-white rounded-full text-white text-center pt-8'>
                                      <ClipLoader />
                                    </div>
                                  )
                                }
                                <div onClick={() => refFile.current?.click()} className='absolute cursor-pointer px-2 w-[100px] h-[100px] rounded-full hover:text-black text-center pt-10 hover:bg-white/50 group'>
                                <p className='group-hover:visible invisible cursor-pointer'>Change</p>
                                </div>
                                <AvatarThumb image={userImage ?? null} name={user?.name + " " + user?.lastName} initials={utils.getNameInitials(user?.name + " " + user?.lastName)} />
                                <Ranking ranking={user?.ranking} />
                                <input ref={refFile} onChange={onChange} type="file" className="hidden" />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </form>

                    <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col'>
                      <table className="border-collapse table-fixed w-full text-sm bg-white">
                        <tbody>
                          {/* ================ */}
                          <tr>
                            <td>
                              <div className="p-4 gap-2 flex items-center">
                                <label className="text-slate-500 w-36 font-bold">MercadoPago Alias:</label>
                                {
                                  editingMode ? (
                                    <input onKeyDown={utils.handleKeyPress} type="text" defaultValue={user?.mercadopago_alias || ''} {...register("mercadopago_alias", { required: false })} className="w-48 rounded border border-slate-200  p-2 text-slate-500 " />
                                    ) : (
                                    <label className="text-slate-500 w-20">{user?.mercadopago_alias}</label>
                                  )
                                }
                                {errors.mercadopago_alias && <span className='px-2 text-red-500'>* Obligatorio</span>}
                              </div>
                            </td>
                          </tr>
                          {/* ================ */}
                          <tr>
                            <td>
                              <div className="p-4 gap-2 flex items-center">
                                <label className="text-slate-500 !w-36 font-bold">Reseña:</label>

                                {
                                  editingMode ? (
                                    <textarea onKeyDown={utils.handleKeyPress} type="text" defaultValue={user?.description || ''} {...register("description", { required: false })} className="w-48 h-40 rounded border border-slate-200  p-2 text-slate-500 " />
                                  ) : (
                                    <label className="text-slate-500 ml-[90px]">{user?.description}</label>
                                  )
                                }

                                {errors.description && <span className='px-2 text-red-500'>* Obligatorio</span>}
                              </div>
                            </td>
                          </tr>
                          {/* ================ */}
                          <tr>
                            <td>
                              <div className="p-4 gap-2 flex items-center">
                                <label className="text-slate-500 w-36 font-bold">Ranking:</label>
                                {
                                  editingMode ? (
                                    <input min={1} max={5} onKeyDown={utils.handleKeyPress} type="number" defaultValue={user?.ranking || ''} {...register("ranking", { required: false })} className="w-48 rounded border border-slate-200  p-2 text-slate-500 " />
                                    ) : (
                                    <label className="text-slate-500 w-20">{user?.ranking}</label>
                                  )
                                }
                                {errors.ranking && <span className='px-2 text-red-500'>* Obligatorio</span>}
                              </div>
                            </td>
                          </tr>
                          {/* ================ */}
                          <tr>
                            <td>
                              <div className="p-4 gap-2 flex items-center">
                                {
                                  editingMode ? (
                                    <div className="gap-2 flex">
                                      <Button variant="destructive" onClick={onCancel}>Cancelar</Button>
                                      <Button variant="default" type="submit" disabled={isLoadingSubmit}>{isLoadingSubmit ? 'Guardando...' : 'Guardar'}</Button>
                                    </div>
                                  ) : (
                                    <div className="gap-2 flex">
                                      <Button variant="alternative" onClick={onEdit}>Editar</Button>
                                    </div>
                                  )
                                }
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl "></div>
              </div>
            </div>
          </>
        ) : (
          <LoadingState />
        )
      }
    </div>
  );
}
