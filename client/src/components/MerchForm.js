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


const ref = useRef('');
const API_URL_UPLOAD = '/api/upload';
const MerchForm = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState(null);

 
  const handleImageUpload = async (file) => {
    const responseUrl = await fetch('/api/resourcesFromUrl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: [file.target.value]
        })
      }).then((res) => res.json()).then(data=>{
            setUrl(data.uploads[0]);
        }
      );
      onClose(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const merchData = {
      name,
      price,
      description,
      url
    };
    onSubmit(merchData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-90vh relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold">X</button>
        <h2 className="text-2xl font-bold mb-4">Agregar Mercancía</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
            <input className="hidden" ref={ref} type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
            <Button className="h-5 px-1" variant="neutral" onClick={() => ref.current?.click()}>Galeria</Button>
            {
              ref.current?.value && (
                <Button className="h-5 px-1 w-16" onClick={() => !loading ? handleUpload() : console.log('disabled')}>{loading ? 'Cargando...' : 'Guardar'}</Button>
              )
            }
          </div>
          <Button type="submit">Agregar</Button>
        </form>
      </div>
    </div>
  );
};

export default MerchForm;