import React from "react";
import Link from "next/link";
import "../styles/Footer.scss";

const Header: React.FC = () => {
  return (
    <header className="p-2 bg-gray-800 text-white">
      <Link href={"/"}>pi-infra-core</Link>
    </header>
  );
};

export default Header;
