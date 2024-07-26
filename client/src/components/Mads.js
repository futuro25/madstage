import React, {useState, useEffect} from "react";

export default function Mads() {

  const users = [{
    id: 1,
    name: 'Andrew Alfred',
    picture: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80'
  },
  {
    id: 2,
    name: 'Aisha Houston',
    picture: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80'
  },
  {
    id: 3,
    name: 'Anna White',
    picture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80'
  },
  {
    id: 4,
    name: 'Andy Flint',
    picture: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80'
  },
  {
    id: 5,
    name: 'Bob Alfred',
    picture: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80'
  },
  {
    id: 6,
    name: 'Bianca Houston',
    picture: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80'
  },
  {
    id: 7,
    name: 'Brianna White',
    picture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80'
  }]

  return (
    <div className="px-4 h-full overflow-auto mt-4">
      <div className="w-full flex sticky top-0 z-10 bg-white rounded pb-4 items-center justify-center mt-4 mb-4">
        <h1 className="inline-block font-extrabold text-slate-500 tracking-tight text-2xl">
            MADS
        </h1>
      </div>

      <div class="grid grid-cols-4 gap-2">
        {
          users.map(user => (
            <div class="flex flex-col items-center justify-center gap-4 p-4" key={user.id}>
              <img class="w-12 h-12 rounded-full" src={user.picture} />
              <strong class="text-slate-900 text-sm font-medium text-center dark:text-slate-200">{user.name}</strong>
            </div>
          ))
        }
      </div>
    </div>
  );
}
