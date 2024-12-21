import React from "react";

export const Header = () => {
  return (
    <header className="bg-orange-400 h-[80px]">
      <div className="w-full h-full flex items-center justify-center">
        <nav className="text-lg text-white font-medium">
          <a href={"/"} className="hover:underline underline-offset-2 mr-6">
            書く
          </a>
          <a href={"/look"} className="hover:underline underline-offset-2">
            見る
          </a>
        </nav>
      </div>
    </header>
  );
};
