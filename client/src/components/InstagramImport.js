import React, { useState } from 'react';

const InstagramImport = ({ onClose, onChange }) => {
  const [username, setUsername] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImport = async () => {
    try {
      const clientId = '541174758644604';
      const client_secret = "8348776397ce214503007c958e82d2f5"
      const redirectUri = encodeURIComponent(window.location.href);
      const scope = 'user_profile,user_media';
      const responseType = 'code';

      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
      
      // Abrir un popup con la URL de autorización
      //window.open(authUrl, 'InstagramAuth', 'width=600,height=700');

      // Reemplaza con tu token de acceso obtenido a través del flujo de autenticación
      const token = 'IGQWROTTNRQjlNX3hSVU81aUJNVnpNdk5IejRXc2ZAMa3F1WE1KaXMwSXVabkVjaEJtTlhRc0o5eVRUN3lZAU09DVXU1RzdtbmN4RXlMMlJuTFoxcUZApNFRIM0lHTlNSRnpKaldhRDBWVU5WS1ZAWX1lYamV3MjRCTDAZD';
      
      const userIdResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${token}`);
      const userIdData = await userIdResponse.json();
      const userId = userIdData.id;

      const mediaResponse = await fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`);
      const mediaData = await mediaResponse.json();

      const images = mediaData.data.filter(media => media.media_type !== 'IMAGE').map(media => ({
        url: media.media_type === "CAROUSEL_ALBUM" ? media.media_url : media.thumbnail_url,
        caption: media.caption,
      }));

      setImages(images);
    } catch (error) {
      console.error('Error fetching Instagram images:', error);
    }
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

  const handleLogSelectedImages = async () => {
    const responseUrl = await fetch('/api/resourcesFromUrl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: selectedImages
        })
      }).then((res) => res.json()).then(data=>{
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
        <button onClick={handleImport} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Cargar imágenes</button>
        <button onClick={handleSelectAll} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 ml-2">Seleccionar todas</button>
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.url} className="relative cursor-pointer" onClick={() => handleCheckboxChange(image.url)}>
                <img src={image.url} alt="Instagram" className="w-full h-auto rounded" />
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.url)}
                  onChange={() => handleCheckboxChange(image.url)}
                  className="absolute top-2 right-2 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleLogSelectedImages} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Log URLs de imágenes seleccionadas</button>
      </div>
    </div>
  );
};

export default InstagramImport;