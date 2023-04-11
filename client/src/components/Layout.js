import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import History from "./History";
import Page404 from "./Page404";
import Home from "./Home";

const Layout = () => {
  const { component } = useParams();
  console.log("component", component);
  return (
    <div className="min-h-full">
      <Navbar component={component} />
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {component === "history" && "History"}
              {component === undefined && "Home"}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {component === "history" ? <History /> : component === undefined || component === null ? <Home /> : <Page404 />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
