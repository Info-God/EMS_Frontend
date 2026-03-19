import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useJournal } from "../../hook/useJournal";
import { setJournalById } from "../../lib/store/features/journalsSlice";
import { useAppDispatch, useAppSelector } from "../../lib/store/store";
import { useUser } from "../../hook/useUser";
import LoadingScreen from "../ui/LoadingScreen";

const AuthLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [image, setImage] = useState("/login.png");

  const { user: loggedUser } = useAppSelector((s) => s.user);
  const { journal } = useJournal();

  const { fetchUser, loading } = useUser();

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    if (loggedUser) return;

    fetchUser();
  }, [fetchUser, loggedUser]);

  useEffect(() => {
    if (loggedUser) {
      navigate("/dashboard/", { replace: true });
    }
  }, [loggedUser, navigate]);

  useEffect(() => {
    switch (pathname) {
      case "/login":
        setImage(`/${journal?.code ?? "login"}.png`);
        break;
      case "/register":
        
        setImage("/register.png");
        break;
      case "/forget-password":
        setImage("/forgot_password.png");
        break;
    }

    if (!journal) {
      const id = Number(localStorage.getItem("journal_id"));
      if (id) dispatch(setJournalById(id));
    }
  }, [pathname, journal, dispatch]);

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-(--journal-700) to-(--journal-500) md:from-white md:to-white relative">
      {loading && <LoadingScreen key={"0001"} title="Journal"/>}
      {/* BRANDING LEFT PANEL */}
      <div className="bg-gradient-to-br from-(--journal-700) to-(--journal-500) text-white hidden md:flex flex-col justify-center px-10 lg:px-20">
        <h3 className="text-lg mb-2">Welcome to</h3>

        <h1 className="text-4xl font-semibold leading-snug">
          {journal?.fullName}
          <br />
          <span className="text-xl">e-ISSN : {journal?.eissn}</span>
        </h1>

        <p className="mt-3 text-sm opacity-80">
          Editorial Management System
        </p>

        <div className="mt-8 bg-white/20 p-4 rounded-xl w-fit">
          <img src={image} className="lg:h-72" alt="Journal Logo" />
        </div>

        <Link to={journal?.link ?? "#"} target="_blank" className="mt-6 text-sm underline cursor-pointer">
          More information about {journal?.code ?? "the journal"}
        </Link>
      </div>

      {/* RIGHT PANEL */}
      <div className=" flex justify-start md:justify-center items-center flex-col">
        <div className="text-white md:hidden mx-5 pt-7 sm:mx-0 sm:px-5 mb-7 sm:text-center">
          <h3 className="text-lg mb-2">Welcome to</h3>

          <h1 className="text-2xl font-semibold leading-snug">
            {journal?.fullName}
          </h1>

          <p className="mt-3 text-sm opacity-80">
            Editorial Management System
          </p>

          {/* <Link to={journal?.link ?? "#"} target="_blank" className="mt-6 text-sm underline cursor-pointer">
            More information about {journal?.code ?? "the journal"}
          </Link> */}
        </div>
        <div className="bg-white shadow-xl rounded-2xl lg:w-[70%] mx-5 sm:p-5 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
