import { IconBrandGithub, IconShoppingCart } from "@tabler/icons";
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 w-full h-16 shadow-md flex items-center">
      <div className="max-w-7xl m-auto w-full flex justify-between">
        <h1 className="text-2xl font-medium">Daraja Marketplace</h1>
        <div className="flex gap-5 items-center">
          <IconBrandGithub size={30} />
          <IconShoppingCart size={30} />
        </div>
      </div>
    </header>
  );
}
