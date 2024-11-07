import React, { useState, useRef } from 'react';
import Button from "./common/Button";


const MerchForm = ({ onClose, onSubmit }) => {
  const API_URL_UPLOAD = '/api/upload';
  const ref = useRef();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState(null);

 

  const handleUpload = async () => {
    setLoading(true)
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetcher(API_URL_UPLOAD, formData);
      console.log("response: ", response)
      await setUrl(response.imageUrls[0])
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
    setLoading(false);

  };

  const fetcher = (url, data) => {
    return fetch(url, {
      method: 'POST',
      body: data,
    }).then((res) => res.json());
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
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <input className="" ref={ref} type="file" onChange={(e) => setFiles(Array.from(e.target.files))} />
            {
              ref.current?.value && (
                <Button type="button" className="h-5 px-1 w-16" onClick={() => !loading ? handleUpload() : console.log('disabled')}>{loading ? 'Cargando...' : 'Guardar'}</Button>
              )
            }
          </div>
          <Button type="button" onClick={handleSubmit}>Agregar</Button>
        </form>
      </div>
    </div>
  );
};

export default MerchForm;