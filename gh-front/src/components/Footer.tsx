import React from "react";
import Link from "next/link";
import "../styles/Footer.scss";
import { getJTC, getUTC } from "../components/TimeFunctions";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white">
      <h1 className="pb-4">自宅サーバー監視システム</h1>
      <h1 className="text-xl">ページ表示時刻</h1>
      <ul className="pb-4 list-disc list-inside">
        <li>日本時間　：{getJTC()}</li>
        <li>世界協定時：{getUTC()}</li>
      </ul>
      <Link className="underline" href={"https://github.com/hashin2425/pi-infra-core"}>
        GitHubリポジトリ｜pi-infra-core
      </Link>
    </footer>
  );
};

export default Footer;
