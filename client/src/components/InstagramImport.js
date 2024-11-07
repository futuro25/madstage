import { Code } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { config } from '../config';

var code;
var newWindow;
var getCode;
var checkUrl;
var shortToLongToken;

var shortToken;
var longToken;
var token;

const login = () => {
  code = null;
  const location = `https://api.instagram.com/oauth/authorize?client_id=${config.instagram.clientId}`
    + `&redirect_uri=${config.instagram.redirectUri}`
    + `&scope=user_profile,user_media`
    + `&response_type=code`;

  newWindow = window.open(location, 'InstagramAuth', 'width=600,height=700');

  clearInterval(getCode);
  getCode = setInterval(() => {
    try {
      code = newWindow.location.search.substring(1).split("&").find(elem => elem.startsWith("code"))?.split("=")[1];
      if (code) {
        clearInterval(getCode);
        newWindow.close();
      }
    } catch (error) { }
  }, 100);

  clearInterval(checkUrl);
  checkUrl = setInterval(() => {
    getShortToken();
  }, 2000);

  clearInterval(shortToLongToken);
  shortToLongToken = setInterval(() => {
    getLongToken();
  }, 10000);
};

const getShortToken = () => {
  try {
    try {
      code = newWindow.location.search.substring(1).split("&").find(elem => elem.startsWith("code"))?.split("=")[1];
    } catch (error) { }
    if (code) {
      // Realiza las acciones necesarias aquí, como obtener el código de autorización
      console.log('Authorization code:', code);
      // Puedes llamar a una función para intercambiar el código por un token de acceso


      if (code) {
        const grantType = 'authorization_code';

        const urlencoded = new URLSearchParams();
        urlencoded.append("client_id", config.instagram.clientId);
        urlencoded.append("client_secret", config.instagram.clientSecret);
        urlencoded.append("grant_type", grantType);
        urlencoded.append("redirect_uri", config.instagram.redirectUri);
        urlencoded.append("code", code);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
          redirect: "follow"
        };
        fetch("/instagram/oauth/access_token", requestOptions)
          .then(response => response.json())
          .then(data => {
            const shortLivedToken = data.access_token;
            if (shortLivedToken) {
              shortToken = shortLivedToken;
              token = shortLivedToken;
              sessionStorage.setItem('shortToken', shortLivedToken);
              sessionStorage.setItem('token', shortLivedToken);
              clearInterval(checkUrl);
            }
          })
          .catch(error => {
            console.error('Error fetching access token:', error);
          });
      }

    }
  } catch (error) {
    // Ignorar errores de CORS
  }
}

const getLongToken = (() => {
  if (shortToken) {
    fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${config.instagram.clientSecret}&access_token=${shortToken}`)
      .then(response => response.json())
      .then(data => {
        const longLivedToken = data.access_token;
        console.log('Long-lived token:', longLivedToken);
        longToken = longLivedToken;
        token = longToken;
        clearInterval(shortToLongToken);
      })
  }
});

const InstagramImport = ({ onClose, onChange }) => {

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (token && images.length === 0) {
      fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${token}`)
        .then(response => response.json())
        .then(data => data.id)
        .then(userId => fetch(`https://graph.instagram.com/${userId}/media?fields=media_type,media_url,thumbnail_url&access_token=${token}`)
          .then(response => response.json()))
        .then(mediaData => {
          const images = mediaData.data.filter(media => media.media_type !== 'IMAGE').map(media => ({
            url: media.media_type === "CAROUSEL_ALBUM" ? media.media_url : media.thumbnail_url,
            caption: media.caption,
          }))
          setImages(images);
        });
    }
  }, [token]);

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
    clearInterval(checkUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-90vh relative">
        <button onClick={close} className="absolute top-4 right-4 text-xl font-bold">X</button>
        <h2 className="text-2xl font-bold mb-4">Importar imágenes desde Instagram</h2>
        {token && <button onClick={handleSelectAll} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 ml-2">Seleccionar todas</button>}
        {!token && <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-2">Login</button>}
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
        <button onClick={handleUploadSelectedImages} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Agregar imágenes seleccionadas</button>
      </div>
    </div>
  );
};

export { InstagramImport, login };