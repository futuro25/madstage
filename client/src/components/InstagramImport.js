import { Code } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { config } from '../config';
import useSWR from 'swr'

const login = () => {}

const InstagramImport = ({ onClose, onChange }) => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoadingSubmit, setiIsLoadingSubmit] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [username, setUsername] = useState('');

  const getImages = () => {
    fetch("/instagram/post/"+username, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.urls);
        setImages(data.urls);
        setImageLoaded(true);
      });
  };

  const handleCheckboxChange = (url) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(url)
        ? prevSelected.filter((image) => image !== url)
        : [...prevSelected, url]
    );
  };

  const handleSelectAll = () => {
    const allImageUrls = images.map(image => image.url);
    setSelectedImages(allImageUrls);
  };

  const handleUploadSelectedImages = async () => {
    setiIsLoadingSubmit(true);
    const responseUrl = await fetch('/api/resourcesFromUrl', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: selectedImages
      })
    }).then((res) => res.json()).then(data => {
      // Llamar a onChange con la URL de la imagen
      if (onChange) {
        onChange(data.uploads);
      }
    }
    );
    onClose(false);
  };

  const close = () => {
    onClose(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-90vh relative">
        <button onClick={close} className="absolute top-4 right-4 text-xl font-bold">X</button>
        <h2 className="text-2xl font-bold mb-4">Importar imágenes desde Instagram</h2>
        {!imageLoaded && (
          <div>
            <input
              type="text"
              placeholder="Ingrese el nombre de usuario"
              className="border p-2 rounded mb-4 w-full"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={getImages} className="bg-blue-500 text-white px-4 py-2 rounded">
              Obtener imágenes
            </button>
          </div>
        )}
        {imageLoaded && (
          <div>
            <button onClick={handleSelectAll} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 ml-2">Seleccionar todas</button>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageLoaded && images.map((image) => (
                  <div key={image} className="relative cursor-pointer" onClick={() => handleCheckboxChange(image)}>
                    <img src={image} alt="Instagram" className="w-full h-auto rounded" />
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image)}
                      onChange={() => handleCheckboxChange(image)}
                      className="absolute top-2 right-2 pointer-events-none"
                    />
                  </div>
                ))}
                {(!imageLoaded && <div className="text-center">Cargando imágenes...</div>)}
              </div>
            </div>
            <button onClick={handleUploadSelectedImages} className="bg-green-500 text-white px-4 py-2 rounded mt-4" disabled={isLoadingSubmit}>{isLoadingSubmit ? 'Subiendo...' : 'Agregar imágenes seleccionadas'}</button>
          </div>)}
      </div>
    </div>
  );
};

export { InstagramImport, login };
