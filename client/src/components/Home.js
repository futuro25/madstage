import React, {useState, useEffect} from "react";

export default function Home() {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="px-4 h-full overflow-auto mt-0">
      <div className="w-full flex flex-col sticky top-0 z-10 bg-white rounded pb-4 items-center justify-center mt-10">
        <h1 className="inline-block font-extrabold text-gray-900 tracking-tight ">
          Bienvenid@ {sessionStorage.name}
        </h1>
        <p className="text-gray-900 italic">selecciona la opcion deseada en el menu lateral</p>
      </div>
    </div>
  );
}
