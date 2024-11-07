import ProfileCard from "./common/ProfileCard";
import React, {useState, useEffect, useRef} from "react";
import { Dialog, DialogContent } from "./common/Dialog";
import LoadingState from "./common/LoadingState";
import { CloseIcon } from "./icons";
import {useSWRConfig} from 'swr'
import * as utils from '../utils/utils'
import Button from "./common/Button";
import useSWR from 'swr'
import Header from "./common/Header";
import {cn, tw} from '../utils/utils';
import {InstagramImport,login} from './InstagramImport';
import MerchForm from './MerchForm';

export default function ProfileMad() {
  const API_URL = '/api/users';
  const API_URL_UPLOAD = '/api/upload';
  const API_URL_DESTROY = '/api/destroy-resources';
  const { data: dataUser } = useSWR(API_URL + "/" + sessionStorage.userId, (url) => fetch(url).then(res => res.json()))

  const [user, setUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pictureLink, setPictureLink] = useState();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonsEnabled, setIsButtonsEnabled] = useState(false);
  const ref = useRef();
  const { mutate } = useSWRConfig()

  const [isMobilePlatform, setIsMobilePlatform] = useState(window.innerWidth <= 768);
  const [isDesktopPlatform, setIsDesktopPlatform] = useState(window.innerWidth > 768);
  const [showInstagramImport, setShowInstagramImport] = useState(false);
  const [showMerchForm, setShowMerchForm] = useState(false);

  const onChange = async (images) => {
    const imagesArray = []
    images.map ((image, index) => {
      imagesArray.push({id: index+1, url: image})
    })
    const totalImages = [...imagesArray, ...dataUser.pictures]
    await mutate(API_URL, utils.patchRequest(`${API_URL}/${sessionStorage.userId}`, {pictures: totalImages}), {optimisticData: false})
    setUser(user => ({
      ...dataUser,
      pictures: totalImages,
    }))
    setLoading(false);
    setIsButtonsEnabled(false)
  }

  const fetcher = (url, data) => {
    return fetch(url, {
      method: 'POST',
      body: data,
    }).then((res) => res.json());
  };


  const removeImage = async (image) => {
    if (window.confirm("Seguro desea eliminar esta imagen?")) {
      const pieces = image.url.split('/');
      const imagePublicId = pieces[pieces.length-1].split('.')[0];
      const totalImages = dataUser.pictures.filter(picture => !picture.url.includes(imagePublicId));
      await mutate(API_URL, utils.patchRequest(`${API_URL}/${sessionStorage.userId}`, {pictures: totalImages}), {optimisticData: false})
      await utils.postRequest(API_URL_DESTROY, imagePublicId);
      setUser(user => ({
        ...dataUser,
        pictures: totalImages,
      }));
    }
  }

  const removeMerch = async (merchItem) => {
    if (window.confirm("Seguro desea eliminar esta mercancía?")) {
      const totalMerch = dataUser.merch.filter(item => item !== merchItem);
      await mutate(API_URL, utils.patchRequest(`${API_URL}/${sessionStorage.userId}`, { merch: totalMerch }), { optimisticData: false });
      setUser(user => ({
        ...dataUser,
        merch: totalMerch,
      }));
    }
  };


  const handleUpload = async () => {
    setLoading(true)
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetcher(API_URL_UPLOAD, formData);
      console.log("response: ", response)
      await onChange(response.imageUrls)
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  const showImage = (url) => {
    setPictureLink(url)
    setIsModalOpen(true)
    console.log(url)
  }

  const handleMerchSubmit = (merchData) => {
    dataUser.merch=[...dataUser.merch, merchData]
    mutate(API_URL, utils.patchRequest(`${API_URL}/${sessionStorage.userId}`, {merch: dataUser.merch}), {optimisticData: false})
    setUser(user => ({
      ...dataUser,
      merch: dataUser.merch
      ,
    }))
  };

  useEffect(() => {
    const tempUser = {
      ...dataUser,
    }
    setUser(tempUser);
  }, [dataUser])

  return (
    <>
    {
      user?._id ? (
        <div className="px-4 h-full overflow-auto mt-0">
          <Header string="Mad's" />
          <ProfileCard key={user.id} user={user} />

          <div className="mt-8">
            <p className="text-justify">{user.description}</p>
          </div>

          <hr className="my-4 text-slate-200" />

          <div className="mt-4">
            <div className="flex items-center justify-between ml-auto">
              <h2 className="inline-block font-extrabold text-gray-800 tracking-tight text-xl">Images</h2>

              <div className="flex ml-auto gap-2 h-10 overflow-hidden">
                {
                  isButtonsEnabled ? (
                    <Button className="h-5 px-1 w-16" variant="destructive" onClick={() => setIsButtonsEnabled(!isButtonsEnabled)}>Cancelar</Button>
                  ) : (
                    <Button className="h-5 px-1 w-16" onClick={() => setIsButtonsEnabled(!isButtonsEnabled)}>Agregar</Button>
                  )
                }
              </div>
            </div>
            
          <div className={cn("flex items-center justify-end ml-auto gap-2 h-0 overflow-hidden transition-all duration-200", {'h-12': isButtonsEnabled})}>
            <input className="hidden" ref={ref} type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />

            <Button className="h-5 px-1" variant="neutral" onClick={() => {setShowInstagramImport(true)}}>Instagram</Button>
            <Button className="h-5 px-1" variant="neutral" onClick={() => ref.current?.click()}>Galeria</Button>
            {showInstagramImport && (<InstagramImport onClose={setShowInstagramImport} onChange={onChange}/>)}
            {
              ref.current?.value && (
                <Button className="h-5 px-1 w-16" onClick={() => !loading ? handleUpload() : console.log('disabled')}>{loading ? 'Cargando...' : 'Guardar'}</Button>
              )
            }
          </div>

            <div className={cn("grid mt-2", isMobilePlatform && 'grid-cols-3 gap-2', isDesktopPlatform && 'grid-cols-8 gap-2')}>

              {
                isDesktopPlatform && (
                  user.pictures.map(image => (
                    <div className="grid place-items-center h-30 border p-1 border-gray-200 cursor-pointer">
                      <img src={image.url} className="h-28 transition-transform duration-200 hover:scale-105" onClick={() => showImage(image.url)} />
                      {/* <div className="hover:text-red-500 flex items-center justify-center mt-2" onClick={() => removeImage(image)}>Eliminar</div> */}
                    </div>
                  ))
                )
              }


              {
                isMobilePlatform && (
                  user.pictures.map(image => (
                    <div className="grid place-items-center h-30 border p-1 border-gray-200 cursor-pointer">
                      <img src={image.url} className="flex items-center justify-center h-20 w-30 object-cover" onClick={() => showImage(image.url)} />
                      <Button className="!bg-red-300 text-black-500 flex items-center justify-center mt-2" onClick={() => removeImage(image)}>Eliminar</Button>
                    </div>
                  ))
                )
              }
            </div>
          </div>

          <div className="flex items-center justify-between ml-auto mt-4">
            <h2 className="inline-block font-extrabold text-gray-800 tracking-tight text-xl">Merch</h2>

            <Button className="ml-auto h-5 px-1 w-16" onClick={() => setShowMerchForm(true)}>Agregar</Button>
              {showMerchForm && (
                <MerchForm
                  onSubmit={handleMerchSubmit}
                  onClose={() => setShowMerchForm(false)}
                />
              )}

          </div>
          <div>
            <div className="grid grid-cols-4 gap-4 mt-2 mb-20">
              {
                user.merch.map(image => (
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-lg shadow-lg max-w-32 p-1">
                      <img src={image.url} />
                    </div>
                    <div>{image.name}</div>
                    <div>${image.price}</div>
                    <Button className="!bg-red-300 text-black-500 flex items-center justify-center mt-2" onClick={() => removeMerch(image)}>Eliminar</Button>
                  </div>
                ))
              }
            </div>
          </div>

          <Dialog open={isModalOpen}>
            <DialogContent>
              <div className="w-full h-full">
                <div className="flex justify-end items-center text-gray-500">
                  <button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </button>
                </div>

                <div className="grid place-items-center h-30 p-1 border-gray-200">
                  <img src={pictureLink} className="py-8" />
                </div>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
                  <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <LoadingState />
      )
    }
    </>
  );
}