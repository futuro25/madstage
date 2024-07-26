import React, {useState, useEffect} from "react";

export default function Settings() {
  const options = [
    'MercadoPago Account Id',
    'Total amount',
    'Scoring',
  ]
  return (
    <div className="px-4 h-full overflow-auto mt-4">
      <div className="w-full flex sticky top-0 z-10 bg-white rounded pb-4 items-center justify-center mt-4 mb-4">
        <h1 className="inline-block font-extrabold text-slate-500 tracking-tight text-2xl">
            SETTINGS
        </h1>
      </div>

      <div class="flex flex-col">
        {
          options.map(data => (
            <div class="flex flex-col items-start justify-center gap-2 p-2">
              <strong class="text-slate-900 text-sm font-medium text-center dark:text-slate-200">{data}</strong>
            </div>
          ))
        }
      </div>
    </div>
  );
}
