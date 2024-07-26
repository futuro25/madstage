import React, {useState, useEffect} from "react";
import { Star } from 'lucide-react';
import { range } from "lodash";
export default function ProfileSponsor() {

  const user = {
    id: 1,
    name: 'Andrew Alfred',
    picture: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80',
    type: 'Sponsor',
    rating: 3,
    description: "Maybe we can live without libraries, people like you and me. Maybe. Sure, we're too old to change the world, but what about that kid, sitting down, opening a book, right now, in a branch at the local library and finding drawings of pee-pees and wee-wees on the Cat in the Hat and the Five Chinese Brothers? Doesn't HE deserve better?",
    pictures: [{id: 1, url: 'https://hips.hearstapps.com/hmg-prod/images/el-columpio-64390762ceeec.jpg?resize=640:*' }, { id: 2, url: 'https://hips.hearstapps.com/hmg-prod/images/el-beso-1639396100.jpeg?resize=980:*' }, { id: 3, url: 'https://hips.hearstapps.com/hmg-prod/images/caminante-64390e7409ef4.jpg?resize=640:*' }, {id: 4, url: 'https://hips.hearstapps.com/hmg-prod/images/el-columpio-64390762ceeec.jpg?resize=640:*'}],
    merch: [{id: 1, name: 'Remera', price: "49,99", url: "https://http2.mlstatic.com/D_NQ_NP_823565-MLA73493194208_122023-O.webp"},  { id: 2, name: 'Gorra', price: "19,99", url: "https://http2.mlstatic.com/D_NQ_NP_654414-MLA77579278870_072024-O.webp" },  { id: 3, name: 'Bermuda', price: "39,99", url: "https://http2.mlstatic.com/D_NQ_NP_983254-MLA53863646135_022023-O.webp"}, {id: 4, name: 'Remera', price: "49,99", url: "https://http2.mlstatic.com/D_NQ_NP_823565-MLA73493194208_122023-O.webp"}]};

  return (
    <div className="px-4 h-full overflow-auto mt-4 px-4">
      <div className="w-full flex sticky top-0 z-10 bg-white rounded pb-4 items-center justify-center mt-4 mb-4">
        <h1 className="inline-block font-extrabold text-gray-800 tracking-tight text-2xl">
            Profile Sponsor
        </h1>
      </div>

      <div className="overflow-visible mb-10 left-4 relative max-w-80 mx-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6 dark:bg-slate-800 dark:highlight-white/5">
        <img className="absolute -left-6 w-24 h-24 rounded-full shadow-lg" src={user.picture} />
        <div className="flex flex-col py-5 pl-24">
          <strong className="text-slate-900 text-sm font-medium dark:text-slate-200">{user.name}</strong>
          <span className="text-slate-500 text-sm font-medium dark:text-slate-400">{user.type}</span>
          <div className="flex mt-1">
            {
              range(user.rating).map(star => (
                <Star className="w-4 h-4 text-yellow-500" />
              ))
            }
            {
              range(user.rating, 5).map(star => (
                <Star className="w-4 h-4" />
              ))
            }
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-justify">{user.description}</p>
      </div>

      <hr className="my-4 text-slate-200" />
    </div>
  );
}
