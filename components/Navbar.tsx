"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { profile } from "@/lib/profile";

export default function Navbar({
  onSearch,
  onNavigate,
}: {
  onSearch: (query: string) => void;
  onNavigate: (tab: string) => void;
}) {
  return (
    <header className="topbar">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link className="logo" href="/" aria-label="Wall home">
          wall<span>.</span>
        </Link>
        <label className="search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search Wall posts</span>
          <input
            type="search"
            placeholder="Search the wall"
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>
        <button className="nav-profile" aria-label={`${profile.firstName}’s wall`} onClick={() => onNavigate("Wall")}>
          <Image
            className="profile-initial"
            src={profile.photo}
            width={30}
            height={30}
            alt=""
          />
          <span>{profile.firstName}’s wall</span>
        </button>
      </nav>
    </header>
  );
}
