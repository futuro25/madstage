import { Code } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const login = () => {
  const code = window.location.search.substring(1).split("&").find(elem => elem.startsWith("code"))?.split("=")[1];
  if(code) return;
  const clientId = '563145449698839';
  const redirectUri = 'https://madstage-a16bef77c5b8.herokuapp.com';
  const location = `https://api.instagram.com/oauth/authorize?client_id=${clientId}`
  + `&redirect_uri=${redirectUri}`
  +`&scope=user_profile,user_media`
  +`&response_type=code`;

  window.open(location, '_blank');
};

const InstagramImport = ({ onClose, onChange })  => {
  const [token, setToken] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);


  useEffect(() => {
    const code = window.location.search.substring(1).split("&").find(elem => elem.startsWith("code"))?.split("=")[1];
    if (code) {
      window.location.hash = "";
      const clientId = '563145449698839';
      const clientSecret = 'e1bc976972340c3aafb62f2057953539';
      const grantType = 'authorization_code';
      const redirectUri = 'https://madstage-a16bef77c5b8.herokuapp.com/';
      
      const urlencoded = new URLSearchParams();
      urlencoded.append("client_id", clientId);
      urlencoded.append("client_secret", clientSecret);
      urlencoded.append("grant_type", grantType);
      urlencoded.append("redirect_uri", redirectUri);
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
        const token = data.access_token;
        console.log('Access token:', token);
        if(token) setToken(token);
      })
      .catch(error => {
        console.error('Error fetching access token:', error);
      });
    }
  }, []);

  useEffect(() => {
//    setToken("IGQWRPdkJ1UUdITXlWMVFqRjdKMEVlcWpwMExhaGFnSnAwQnhYTkU3RUE4QXdVZAm82VXhwcDNsY1ZA4MGcwTW5aNndqZAkgyd1g5YmZAXVW9FYVpVaFM3YVZAZANTlRNy1jakFPeVJfTVVDZAnRFZAk9TVXNrcUdpem4tbGFQVk5scVFRbnVCWVEZD");
    if (token && images.length === 0) {
      fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${token}`)
        .then(response => response.json())
        .then(data=>data.id)
        .then(userId => fetch(`https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`)
                    .then(response => response.json()))
                    .then(mediaData =>  {
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
  
export {InstagramImport,login};