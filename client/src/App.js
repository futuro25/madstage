import {
  NavLink,
  Navigate,
  Route,
  Routes,
  Outlet,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

import React, { useState, useEffect } from "react";
import logo2 from "./logo2.png";
import "./App.css";
import _, { capitalize } from "lodash";
import Home from "./components/Home";
import Sponsors from "./components/Sponsors";
import Mads from "./components/Mads";
import Settings from "./components/Settings";
import ProfileMad from "./components/ProfileMad";
import ProfileFan from "./components/ProfileFan";
import ProfileSponsor from "./components/ProfileSponsor";
import { cn, tw } from "./utils/utils";
import Login from "./components/Login";
import PaymentNotifications from "./components/PaymentNotifications";
import Logout from "./components/Logout";
import Invite from "./components/Invite";
import CreateAccount from "./components/CreateAccount";
import ForgotPassword from "./components/ForgotPassword";
import MercadoPago from "./components/MercadoPago";
import {
  LayoutList,
  User,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { config } from "./config";

const getMenu = (userType) => {
  return [
    "mads",
    "sponsors",
    "profile-mad",
    "profile-fan",
    "profile-sponsor",
    "settings",
    "mercadoPago",
    "logout",
  ];

  if (userType === "MAD") {
    return ["sponsors", "profile-mad", "settings", "logout"];
  }

  if (userType === "FAN") {
    return ["mads", "profile-fan", "settings", "logout"];
  }

  if (userType === "SPONSOR") {
    return ["mads", "profile-sponsor", "settings", "logout"];
  }
};

function getIconForMenu(option) {
  switch (option) {
    case "sponsors":
      return <>Ss</>;
      break;
    case "profile-mad":
      return <>PM</>;
      break;
    case "settings":
      return <SettingsIcon />;
      break;
    case "logout":
      return <LogOut />;
      break;
    case "mads":
      return <>Ms</>;
      break;
    case "profile-fan":
      return <>PF</>;
      break;
    case "profile-sponsor":
      return <>PS</>;
      break;
    case "mercadoPago":
      return <>MP</>;
      break;
  }
}

export default function App() {
  const [searchParams] = useSearchParams();

  const user = sessionStorage.email || null;
  const inviteId = searchParams.get("inviteId") || null;
  const location = useLocation();

  if (user === undefined) {
    return null;
  }

  if (user === null) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <Navigate to="/login" state={{ referrer: location.pathname }} />
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/invite" element={<Invite inviteId={inviteId} />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/payment-notifications"
          element={<PaymentNotifications />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/">
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="mads" element={<Mads />} />
          <Route path="settings" element={<Settings />} />
          <Route path="home" element={<Home />} />
          <Route path="profile-mad" element={<ProfileMad />} />
          <Route path="profile-fan" element={<ProfileFan />} />
          <Route path="profile-sponsor" element={<ProfileSponsor />} />
          <Route path="mercadoPago" element={<MercadoPago />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="bg-black-madstage">
              <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8">
                  <div className="border-t border-gray-200 text-center pt-8">
                    <h1 className="text-9xl font-bold text-gray-400">404</h1>
                    <h1 className="text-6xl font-medium py-8">
                      Pagina no encontrada
                    </h1>
                    <p className="text-2xl pb-8 px-12 font-medium">
                      Ups! La pagina que esta buscando no existe. Vuelva al
                      inicio haciendo click en el boton.
                    </p>
                    <button
                      className="bg-black-madstage hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-6"
                      onClick={() => window.location.assign("/")}
                    >
                      IR AL INICIO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Layout({ children }) {
  const [isMobilePlatform, setIsMobilePlatform] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobilePlatform(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userType = sessionStorage.type;
  return (
    <div className="flex flex-col w-full h-screen text-gray-700">
      <nav
        className={cn(
          "flex justify-between items-center pr-6 w-full h-16 bg-black-madstage text-white print:hidden"
        )}
      >
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => window.location.assign("/")}
        >
          <>
            <img
              src={logo2}
              alt="logo"
              className="ml-4 w-14 h-14 object-cover"
            />
            <h1 className="inline-block text-2xl sm:text-3xl text-white pl-2 tracking-tight ">
              mad stage
            </h1>
          </>
        </div>
        {isMobilePlatform ? (
          <BottomMobileMenu userType={userType} />
        ) : (
          <Profile />
        )}
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {!isMobilePlatform && (
          <div
            className={cn(
              "flex flex-col w-[120px] text-white justify-start items-center bg-black-madstage print:hidden"
            )}
          >
            {getMenu(userType).map((el, i) => {
              return (
                <NavLink
                  key={i}
                  className={cn(
                    "h-16 w-full flex items-center pl-2 hover:text-white hover:bg-black-madstage cursor-pointer"
                  )}
                  to={el}
                >
                  {capitalize(el.replace("-", " "))}
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 bg-white w-full">{children}</main>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="flex items-center justify-end gap-2 h-full mt-2">
      <p>{sessionStorage.username}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    </div>
  );
}

function MobileMenu({ userType }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <div
        id="menu"
        className={cn(
          "absolute mt-5 z-10 right-0 h-full bg-black-madstage w-0 transition-all duration-200 z-20",
          open && "w-[160px]"
        )}
      >
        <div className="flex flex-col justify-start items-center">
          {getMenu(userType).map((el, i) => {
            return (
              <NavLink
                key={i}
                className="h-16 w-full flex items-center text-white pl-4 hover:bg-gray-400 cursor-pointer"
                to={el}
                onClick={() => setOpen(!open)}
              >
                {capitalize(el)}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BottomMobileMenu({ userType }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black-madstage text-white flex justify-between">
      {getMenu(userType).map((el, i) => {
        return (
          <NavLink
            key={i}
            className="h-16 w-full flex items-center justify-center text-white hover:bg-gray-400 cursor-pointer"
            to={el}
            onClick={() => setOpen(!open)}
          >
            {getIconForMenu(el)}
          </NavLink>
        );
      })}
    </div>
  );
}
