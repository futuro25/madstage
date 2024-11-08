import ProfileCard from "./common/ProfileCard";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./common/Dialog";
import LoadingState from "./common/LoadingState";
import { CloseIcon } from "./icons";
import Button from "./common/Button";
import useSWR from "swr";
import Header from "./common/Header";

export default function ProfileMad() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = "/api/users";
  const { data: dataUser } = useSWR(
    API_URL + "/" + sessionStorage.userId,
    (url) => fetch(url).then((res) => res.json())
  );
  const [user, setUser] = useState({});

  useEffect(() => {
    const tempUser = {
      ...dataUser,
      pictures: [],
      merch: [],
    };
    setUser(tempUser);
  }, [dataUser]);

  return (
    <>
      {user?._id ? (
        <div className="px-4 h-full overflow-auto mt-0">
          <Header string="Profile Fan" />
          <ProfileCard key={user.id} user={user} />

          <div className="mt-8">
            <p className="text-justify">{user.description}</p>
          </div>

          <hr className="my-4 text-slate-200" />

          <Dialog open={isModalOpen}>
            <DialogContent>
              <div className="w-[500px] h-[400px]">
                <div className="flex justify-end items-center text-gray-500">
                  <button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </button>
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <Button onClick={() => setIsModalInvoiceOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <LoadingState />
      )}
    </>
  );
}
