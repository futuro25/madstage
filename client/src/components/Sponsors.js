import React, {useState, useEffect} from "react";
import ProfileCard from "./common/ProfileCard";
import useSWR from 'swr'
import LoadingState from "./common/LoadingState";
import Header from "./common/Header";

export default function Sponsors() {

  const API_URL = '/api/users?type=sponsor';
  const { data: dataUsers } = useSWR(API_URL, (url) => fetch(url).then(res => res.json()))

  return (
    <>
      {
        dataUsers?.length ? (
          <div className="px-4 h-full overflow-auto mt-4">
            <Header string="Sponsors" />

            <div className="grid gap-2 space-y-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {
                dataUsers?.map(user => (
                  <ProfileCard key={user._id} mode="vertical" user={user} />
                ))
              }
            </div>
          </div>
        ) : (
          <LoadingState />
        )
      }
    </>
  );
}
