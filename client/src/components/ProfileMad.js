import ProfileCard from "./common/ProfileCard";
import React, {useState, useEffect} from "react";
import { Dialog, DialogContent } from "./common/Dialog";
import LoadingState from "./common/LoadingState";
import { CloseIcon } from "./icons";
import Button from "./common/Button";
import useSWR from 'swr'
import Header from "./common/Header";

export default function ProfileMad() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = '/api/users';
  const { data: dataUser } = useSWR(API_URL + "/" + sessionStorage.userId, (url) => fetch(url).then(res => res.json()))
  const [user, setUser] = useState({});
  
  useEffect(() => {
    const tempUser = {
      ...dataUser,
      pictures: [{id: 1, url: 'https://hips.hearstapps.com/hmg-prod/images/el-columpio-64390762ceeec.jpg?resize=640:*' }, { id: 2, url: 'https://hips.hearstapps.com/hmg-prod/images/el-beso-1639396100.jpeg?resize=980:*' }, { id: 3, url: 'https://hips.hearstapps.com/hmg-prod/images/caminante-64390e7409ef4.jpg?resize=640:*' }, {id: 4, url: 'https://hips.hearstapps.com/hmg-prod/images/el-columpio-64390762ceeec.jpg?resize=640:*'}],
      merch: [{id: 1, name: 'Remera', price: "49,99", url: "https://http2.mlstatic.com/D_NQ_NP_823565-MLA73493194208_122023-O.webp"},  { id: 2, name: 'Gorra', price: "19,99", url: "https://http2.mlstatic.com/D_NQ_NP_654414-MLA77579278870_072024-O.webp" },  { id: 3, name: 'Bermuda', price: "39,99", url: "https://http2.mlstatic.com/D_NQ_NP_983254-MLA53863646135_022023-O.webp"}, {id: 4, name: 'Remera', price: "49,99", url: "https://http2.mlstatic.com/D_NQ_NP_823565-MLA73493194208_122023-O.webp"}],
    }
    setUser(tempUser);
  }, [dataUser])


  return (
    <>
    {
      user?._id ? (
        <div className="px-4 h-full overflow-auto mt-4">
          <Header string="Mad's" />
          <ProfileCard key={user.id} user={user} />

          <div className="mt-8">
            <p className="text-justify">{user.description}</p>
          </div>

          <hr className="my-4 text-slate-200" />

          <div className="mt-4">
          <div className="flex items-center justify-between ml-auto">
            <h2 className="inline-block font-extrabold text-gray-800 tracking-tight text-xl">Images</h2>
            <span>+ Agregar</span>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {
                user.pictures.map(image => (
                  <div className="rounded-lg shadow-lg max-w-32">
                    <img src={image.url} />
                  </div>
                ))
              }
            </div>
          </div>

          <div className="mt-4">
            <h2 className="inline-block font-extrabold text-gray-800 tracking-tight text-xl">Merch</h2>
            
            <div className="grid grid-cols-4 gap-4 mt-2">
              {
                user.merch.map(image => (
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-lg shadow-lg max-w-32 p-1">
                      <img src={image.url} />
                    </div>
                    <div>{image.name}</div>
                    <div>${image.price}</div>
                  </div>
                ))
              }
            </div>
          </div>

          <Dialog open={isModalOpen}>
            <DialogContent>
              <div className="w-[500px] h-[400px]">
                <div className="flex justify-end items-center text-gray-500">
                  <button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </button>
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <Button onClick={() => setIsModalInvoiceOpen(false)}>Cerrar</Button>
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