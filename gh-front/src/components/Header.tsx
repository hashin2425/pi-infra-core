import React from "react";
import Link from "next/link";
import "../styles/Footer.scss";

const Header: React.FC = () => {
  return (
    <header className="p-2 bg-gray-800 text-white">
      <div>
        <p>pi-infra-core dashboard</p>
      </div>
      <div className="mt-2">
        <Link className="rounded mr-2 px-2 border border-white inline-block hover:bg-gray-600" href={"/"}>
          /v1-azure
        </Link>
        <Link className="rounded mr-2 px-2 border border-white inline-block hover:bg-gray-600" href={"/v2"}>
          /v2-aws
        </Link>
      </div>
    </header>
  );
};

export default Header;
