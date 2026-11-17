"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Camera,
  MapPin,
  GraduationCap,
  MessageSquare,
  UserRound,
  Images,
  Box,
} from "lucide-react";
import Navbar from "./Navbar";
import WallFeed from "./WallFeed";
import { profile } from "@/lib/profile";
import { photos } from "@/lib/photos";

const tabs = [
  { name: "Wall", icon: MessageSquare },
  { name: "Info", icon: UserRound },
  { name: "Photos", icon: Images },
  { name: "Boxes", icon: Box },
];

export default function Profile() {
  const [tab, setTab] = useState("Wall");
  const [query, setQuery] = useState("");
  return (
    <div className="page-shell">
      <div className="wall-app">
        <Navbar
          onSearch={(value) => {
            setQuery(value);
            setTab("Wall");
          }}
          onNavigate={setTab}
        />
        <main className="profile-layout" id="main-content">
          <aside
            className="left-sidebar"
            aria-label={`${profile.firstName}’s profile`}
          >
            <div className="profile-photo">
              <Image
                src={profile.photo}
                width={400}
                height={400}
                priority
                alt={profile.name}
              />
              <span className="photo-caption">
                <Camera size={12} /> Profile photo
              </span>
            </div>
            <div className="profile-identity">
              <h1>{profile.name}</h1>
              <p>
                {profile.bio} <br />
                {profile.status}
              </p>
              <span className="profile-location">
                <MapPin size={13} /> {profile.city}
              </span>
            </div>
            <nav className="profile-tabs" aria-label="Profile sections">
              {tabs.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  className={tab === name ? "active" : ""}
                  aria-current={tab === name ? "page" : undefined}
                  onClick={() => setTab(name)}
                >
                  <Icon size={16} />
                  {name}
                  {tab === name && <ArrowUpRight size={14} />}
                </button>
              ))}
            </nav>
            <section className="information">
              <h2>Information</h2>
              <dl>
                <dt>Networks</dt>
                <dd>
                  <GraduationCap size={15} /> {profile.school}
                </dd>
                <dt>Current city</dt>
                <dd>{profile.city}</dd>
              </dl>
            </section>
            <p className="sidebar-note">
              A familiar place for
              <br />
              keeping in touch.
            </p>
          </aside>
          <div className="wall-column">
            {tab === "Wall" && (
              <>
                <div className="section-heading">
                  <div>
                    <h2>The Wall</h2>
                    <p>Little updates. Good conversations.</p>
                  </div>
                  <span className="wall-visibility">Open to everyone</span>
                </div>
                <WallFeed query={query} />
              </>
            )}
            {tab === "Info" && (
              <section className="detail-panel">
                <div className="section-heading">
                  <div>
                    <h2>About {profile.firstName}</h2>
                    <p>A few things you might like to know.</p>
                  </div>
                </div>
                <h3>Basic information</h3>
                <dl>
                  <dt>Current city</dt>
                  <dd>{profile.city}</dd>
                  <dt>Networks</dt>
                  <dd>{profile.school}</dd>
                  <dt>About me</dt>
                  <dd>{profile.about}</dd>
                  <dt>Interests</dt>
                  <dd>{profile.interests}</dd>
                </dl>
                <h3>Education</h3>
                <p>{profile.school}</p>
              </section>
            )}
            {tab === "Photos" && (
              <section className="detail-panel">
                <div className="section-heading">
                  <div>
                    <h2>Photos</h2>
                    <p>My photo, plus a few things I’m into.</p>
                  </div>
                </div>
                <div className="photo-gallery">
                  {photos.map((photo) => (
                    <figure
                      key={photo.id}
                      className={`gallery-photo gallery-photo-${photo.id}`}
                    >
                      <a
                        href={photo.src}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${photo.title}`}
                      >
                        <Image
                          src={photo.src}
                          width={1000}
                          height={667}
                          sizes="(max-width: 650px) 90vw, 400px"
                          alt={photo.alt}
                        />
                      </a>
                      <figcaption>
                        <strong>{photo.title}</strong>
                        {photo.source ? (
                          <a
                            href={photo.source}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Inspiration · Photo by {photo.credit}{" "}
                            <ArrowUpRight size={11} />
                          </a>
                        ) : (
                          <span>{photo.credit} · Personal photo</span>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className="gallery-note">
                  Interest photos sourced from Unsplash. Open a photo to view
                  it, or follow its credit to see the original.
                </p>
              </section>
            )}
            {tab === "Boxes" && (
              <section className="detail-panel">
                <div className="section-heading">
                  <div>
                    <h2>Favorite things</h2>
                    <p>A little corner of my world.</p>
                  </div>
                </div>
                <dl className="favorites">
                  <dt>On repeat</dt>
                  <dd>{profile.music}</dd>
                  <dt>Currently playing</dt>
                  <dd>{profile.games}</dd>
                  <dt>Interests</dt>
                  <dd>Programming · Badminton</dd>
                </dl>
              </section>
            )}
          </div>
        </main>
      </div>
      <footer>
        <span>
          <strong>wall.</strong> A little like the old days.
        </span>
        <span>An independent, nostalgic recreation.</span>
      </footer>
    </div>
  );
}
