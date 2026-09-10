import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaTopScrim, fileToBase64 } from "@hatch/space-sdk/client";
import { api, type ApiResponse } from "./api";
import { channels } from "./channels";
import heroVideo from "./assets/media-generation-reelwave-hero-atmosphere-0-15d0aad8-aadd-4a16-9c36-8b864948676c.mp4";
import coldCaseCapitalVideo from "./assets/cold-case-capital-full-narrated.mp4";
import mintMobileCommercial from "./assets/mint-mobile-commercial.mp4";
import burgerKingCommercial from "./assets/commercial-burger-king.mp4";
import mcdonaldsCommercial from "./assets/commercial-mcdonalds.mp4";
import wendysCommercial from "./assets/commercial-wendys.mp4";
import lowesCommercial from "./assets/lowes-commercial.mp4";
import badBoyBodyguardPoster from "./assets/micro-bad-boy-bodyguard.jpg";
import dramilyPoster from "./assets/micro-dramily.webp";
import lyraMobPoster from "./assets/micro-lyramob.webp";
import alphaMatePoster from "./assets/micro-my-alpha-mate.jpg";
import hiddenHeiressPoster from "./assets/micro-hidden-heiress.jpg";
import secretBabyPoster from "./assets/micro-secret-baby.webp";
import secretlySpoiledPoster from "./assets/micro-secretly-spoiled.jpg";
import shortflixPoster from "./assets/micro-shortflix.jpg";
import cursedAlphaPoster from "./assets/micro-cursed-alpha.jpg";
import badgeOfHonorPoster from "./assets/badge-of-honor.webp";
import badgeOfHonorTeaser from "./assets/badge-of-honor-teaser.mp4";

type Post = ApiResponse<typeof api, "listPosts">["posts"][number];
type GuideChannel = (typeof channels)[number];
type MicroDrama = { title: string; poster: string; label: string; genre: string; teaser?: string };
type PageKey = "home" | "movies" | "tv-shows" | "music" | "radio" | "theater" | "podcast" | "trailers" | "commercials" | "community" | "guide";

const navItems: readonly { label: string; page: PageKey }[] = [
  { label: "Home", page: "home" }, { label: "Movies", page: "movies" }, { label: "TV Shows", page: "tv-shows" },
  { label: "Music", page: "music" }, { label: "Radio", page: "radio" }, { label: "Theater", page: "theater" },
  { label: "Podcast", page: "podcast" }, { label: "Trailers", page: "trailers" }, { label: "Commercials", page: "commercials" },
  { label: "Community", page: "community" }, { label: "Guide", page: "guide" },
];
const validPages = new Set<PageKey>(navItems.map((item) => item.page));
const topics = ["Movies", "TV Shows", "Music", "Radio", "Theater", "Podcasts", "Trailers", "Community"] as const;
const pageGenres: Record<Exclude<PageKey, "home">, readonly string[]> = {
  movies: ["All", "Drama", "Mystery", "Romance"],
  "tv-shows": ["All", "Crime", "Drama", "Sci-Fi", "Micro Drama"],
  music: ["All", "Ambient", "Soundtrack", "Live Session", "Talk"],
  radio: ["All", "Ambient", "Talk", "Soundtrack", "Live Session"],
  theater: ["All", "New Work", "Drama", "Musical", "Documentary"],
  podcast: ["All", "Culture", "Film", "Music", "Interviews"],
  trailers: ["All", "Drama", "Micro Drama", "Commercial"],
  commercials: ["All", "Wireless", "Food", "Home Improvement"],
  community: ["All", "Movies", "TV Shows", "Music", "Radio", "Theater", "Podcasts", "Trailers"],
  guide: ["All", "Facebook", "Instagram", "YouTube"],
};
const pageTitles: Record<Exclude<PageKey, "home">, { kicker: string; title: string; accent: string; deck: string }> = {
  movies: { kicker: "Movies", title: "Stories for the", accent: "big screen", deck: "Features, mysteries, and quiet dramas selected by Reelwave." },
  "tv-shows": { kicker: "TV Shows", title: "Your next", accent: "series", deck: "A growing catalog of crime, drama, sci-fi, and short-form shows." },
  music: { kicker: "Music", title: "Sound for every", accent: "scene", deck: "Scores, live sessions, and conversations in sound." },
  radio: { kicker: "Radio", title: "Stay on the", accent: "signal", deck: "Reelwave stations, hosts, and scheduled shows—all in one listening room." },
  theater: { kicker: "Theater", title: "Take your", accent: "seat", deck: "New work and live performances made for the room." },
  podcast: { kicker: "Podcast", title: "Listen a little", accent: "closer", deck: "Reelwave conversations about the stories and sounds that stay with us." },
  trailers: { kicker: "Trailers", title: "Press play on", accent: "what’s next", deck: "Full episodes, teasers, and commercials in one playable library." },
  commercials: { kicker: "Commercials", title: "A word from", accent: "our sponsors", deck: "The complete Reelwave commercial break—wireless, food, and home improvement spots, ready to play." },
  community: { kicker: "Community", title: "Good stories", accent: "travel", deck: "Post a note, upload media, and join the open channel." },
  guide: { kicker: "397 channels · Starting at CH 0", title: "The", accent: "Guide", deck: "Channel numbers, current show listings, titles, and times in one searchable lineup." },
};
const movieCatalog = [
  { title: "Midnight Orbit", genre: "Romance", eyebrow: "Featured film", subtitle: "A quiet love story that begins during a citywide blackout", tone: "orbit" },
  { title: "Glass Harbor", genre: "Mystery", eyebrow: "Late selection", subtitle: "One last crossing before the tide turns", tone: "harbor" },
  { title: "The Long Room", genre: "Drama", eyebrow: "Repertory", subtitle: "A locked door. An unfinished score.", tone: "room" },
] as const;
const tvCatalog = [
  { title: "Cold Case Capital", genre: "Crime", meta: "Full narrated episode", description: "A capital-city case reopens, and the evidence refuses to stay buried." },
  { title: "The Static Between Us", genre: "Sci-Fi", meta: "Season 2", description: "A signal returns after eight years. So does everything they left unsaid." },
  { title: "Badge of Honor", genre: "Crime", meta: "Micro Drama · Teaser", description: "A cop drama built for short, sharp episodes and cliffhanger turns." },
] as const;
const microDramas: readonly MicroDrama[] = [
  { title: "Badge of Honor", poster: badgeOfHonorPoster, label: "Cop drama · Teaser available", genre: "Micro Drama", teaser: badgeOfHonorTeaser },
  { title: "Bad Boy Bodyguard and His CEO Wife", poster: badBoyBodyguardPoster, label: "Romance mini series", genre: "Micro Drama" },
  { title: "Dramily Hero Cover", poster: dramilyPoster, label: "Dramily short drama", genre: "Micro Drama" },
  { title: "LyraMob Short Drama Cover", poster: lyraMobPoster, label: "LyraMob short drama", genre: "Micro Drama" },
  { title: "My Alpha Mate", poster: alphaMatePoster, label: "Fantasy romance", genre: "Micro Drama" },
  { title: "My Hidden Heiress — CEO Daddy's Secret Baby", poster: hiddenHeiressPoster, label: "Romance mini series", genre: "Micro Drama" },
  { title: "Secret Baby for the CEO", poster: secretBabyPoster, label: "Romance mini series", genre: "Micro Drama" },
  { title: "Secretly Spoiled by My Billionaire Husband", poster: secretlySpoiledPoster, label: "Romance mini series", genre: "Micro Drama" },
  { title: "Shortflix Short Drama Cover", poster: shortflixPoster, label: "Shortflix mini series", genre: "Micro Drama" },
  { title: "The Cursed Alpha's Mate", poster: cursedAlphaPoster, label: "Fantasy romance", genre: "Micro Drama" },
] as const;
const commercials = [
  { title: "Mint Mobile", category: "Wireless", label: "Wireless commercial", src: mintMobileCommercial },
  { title: "Burger King", category: "Food", label: "Restaurant commercial", src: burgerKingCommercial },
  { title: "McDonald's", category: "Food", label: "Restaurant commercial", src: mcdonaldsCommercial },
  { title: "Wendy's", category: "Food", label: "Restaurant commercial", src: wendysCommercial },
  { title: "Lowe's", category: "Home Improvement", label: "Home improvement commercial", src: lowesCommercial },
] as const;
const trailers = [
  { title: "Cold Case Capital", genre: "Drama", label: "Full episode · 4m 40s", src: coldCaseCapitalVideo },
  { title: "Badge of Honor", genre: "Micro Drama", label: "Official teaser", src: badgeOfHonorTeaser, poster: badgeOfHonorPoster },
  ...commercials.map((item) => ({ ...item, genre: "Commercial" as const })),
] as const;
const guidePrograms = {
  Facebook: ["Community Spotlight", "Group Live", "Top Posts", "Member Showcase"],
  Instagram: ["Creator Spotlight", "Latest Stories", "Reel Roundup", "Behind the Feed"],
  YouTube: ["Matt Grosso Live", "Featured Video", "Channel Premiere", "Creator Showcase"],
} as const;
const radioStations = [
  { id: "night-signal", name: "Night Signal", genre: "Ambient", host: "Mara Quinn", show: "After Dark", description: "Unhurried songs for the city after dark.", color: "coral" },
  { id: "reel-talk", name: "Reel Talk", genre: "Talk", host: "Jordan Vale", show: "The Scene", description: "Directors, performers, and the stories behind the work.", color: "slate" },
  { id: "score-room", name: "The Score Room", genre: "Soundtrack", host: "Eli Mercer", show: "Music in Motion", description: "Film scores, title themes, and music built for pictures.", color: "gold" },
  { id: "room-sessions", name: "Room Sessions", genre: "Live Session", host: "Nia Cole", show: "Studio One", description: "Small-room performances with the edges left in.", color: "green" },
] as const;

function getGuideListing(channel: GuideChannel, currentTime: Date) {
  const start = new Date(currentTime); start.setSeconds(0, 0); start.setMinutes(Math.floor(start.getMinutes() / 30) * 30);
  const end = new Date(start.getTime() + 30 * 60 * 1000); const nextEnd = new Date(end.getTime() + 30 * 60 * 1000);
  const slotNumber = Math.floor(start.getTime() / (30 * 60 * 1000)); const titles = guidePrograms[channel.source];
  const titleIndex = ((channel.number + slotNumber) % titles.length + titles.length) % titles.length;
  const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  return { currentTitle: titles[titleIndex], currentTime: `${time.format(start)}–${time.format(end)}`, nextTitle: titles[(titleIndex + 1) % titles.length], nextTime: `${time.format(end)}–${time.format(nextEnd)}` };
}
function Icon({ name }: { name: "search" | "play" | "bookmark" | "arrow" | "menu" | "close" | "upload" | "user" }) {
  const paths = { search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>, play: <path d="m8 5 11 7-11 7V5Z"/>, bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z"/>, arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>, menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>, close: <><path d="m6 6 12 12M18 6 6 18"/></>, upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 14v6h14v-6"/></>, user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></> };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{paths[name]}</svg>;
}
function PageHeader({ page, genre, setGenre }: { page: Exclude<PageKey, "home">; genre: string; setGenre: (value: string) => void }) {
  const copy = pageTitles[page];
  return <header className="page-header"><p className="eyebrow">{copy.kicker}</p><h1>{copy.title} <em>{copy.accent}</em>.</h1><p>{copy.deck}</p><div className="genre-tabs" role="group" aria-label={`${copy.kicker} genres`}>{pageGenres[page].map((item) => <button key={item} className={genre === item ? "active" : ""} aria-pressed={genre === item} onClick={() => setGenre(item)}>{item}</button>)}</div></header>;
}
function SectionHead({ number, title, accent }: { number: string; title: string; accent: string }) { return <header className="section-head"><p className="eyebrow">{number}</p><h2>{title} <em>{accent}</em></h2></header>; }
function PosterCard({ eyebrow, title, subtitle, tone }: { eyebrow: string; title: string; subtitle: string; tone: string }) { return <article className={`poster-card ${tone}`} tabIndex={0}><div className="poster-grain" aria-hidden="true"/><div className="poster-copy"><span>{eyebrow}</span><h3>{title}</h3><p>{subtitle}</p></div></article>; }
function FeedPost({ post }: { post: Post }) {
  const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(post.createdAt));
  return <article className="feed-post"><header><span className="avatar" aria-hidden="true">{post.initials}</span><div><strong>{post.authorName}</strong><p>{post.topic} · {when}</p></div></header><p className="post-body">{post.body}</p>{post.mediaUrl && post.mediaType?.startsWith("image/") && <img src={post.mediaUrl} alt={post.mediaName || "Community upload"}/>} {post.mediaUrl && post.mediaType?.startsWith("video/") && <video src={post.mediaUrl} controls playsInline aria-label={post.mediaName || "Community video upload"}/>}</article>;
}
function RecentUploadCard({ post }: { post: Post }) {
  const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(post.createdAt));
  return <article className="recent-upload-card">
    <div className="recent-upload-media">
      {post.mediaUrl && post.mediaType?.startsWith("image/") && <img src={post.mediaUrl} alt={post.mediaName || `Upload by ${post.authorName}`}/>} 
      {post.mediaUrl && post.mediaType?.startsWith("video/") && <video src={post.mediaUrl} controls playsInline preload="metadata" aria-label={post.mediaName || `Video uploaded by ${post.authorName}`}/>} 
    </div>
    <div className="recent-upload-copy"><span className="avatar" aria-hidden="true">{post.initials}</span><div><strong>{post.authorName}</strong><p>{post.topic} · {when}</p></div></div>
    <p>{post.body}</p>
  </article>;
}

export function App() {
  const queryClient = useQueryClient();
  const initialPage = (() => { const value = window.location.hash.replace("#", "") as PageKey; return validPages.has(value) ? value : "home"; })();
  const [page, setPage] = useState<PageKey>(initialPage); const [menuOpen, setMenuOpen] = useState(false); const [accountOpen, setAccountOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date()); const [search, setSearch] = useState(""); const [guideSearch, setGuideSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<Record<Exclude<PageKey, "home">, string>>({ movies: "All", "tv-shows": "All", music: "All", radio: "All", theater: "All", podcast: "All", trailers: "All", commercials: "All", community: "All", guide: "All" });
  const [selectedDrama, setSelectedDrama] = useState<MicroDrama | null>(null); const [selectedStation, setSelectedStation] = useState<(typeof radioStations)[number]>(radioStations[0]); const [radioPlaying, setRadioPlaying] = useState(false); const [podPlaying, setPodPlaying] = useState(false);
  const [heroChannelNumber, setHeroChannelNumber] = useState(0);
  const [topic, setTopic] = useState<(typeof topics)[number]>("Community"); const [note, setNote] = useState(""); const [upload, setUpload] = useState<{ blobKey: string; mediaType: string; fileName: string; preview: string } | null>(null); const [notice, setNotice] = useState(""); const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const onHash = () => { const value = window.location.hash.replace("#", "") as PageKey; setPage(validPages.has(value) ? value : "home"); }; window.addEventListener("hashchange", onHash); return () => window.removeEventListener("hashchange", onHash); }, []);
  const session = useQuery({ queryKey: ["session"], queryFn: () => api.getSession({}) }); const posts = useQuery({ queryKey: ["posts"], queryFn: () => api.listPosts({ limit: 50 }) });
  const saveTitle = useMutation({ mutationFn: () => api.saveFeatured({}), onSuccess: (result) => { setNotice(result.error || (result.saved ? "Added Midnight Orbit to My List." : "Removed Midnight Orbit from My List.")); queryClient.invalidateQueries({ queryKey: ["session"] }); } });
  const uploadMedia = useMutation({ mutationFn: (args: { fileName: string; mimeType: string; dataBase64: string }) => api.uploadMedia(args) });
  const publish = useMutation({ mutationFn: () => api.publishPost({ topic, body: note, mediaBlobKey: upload?.blobKey || null }), onSuccess: (result) => { if (!result.ok) return setNotice(result.error || "Could not publish that post."); if (upload?.preview) URL.revokeObjectURL(upload.preview); setNote(""); setUpload(null); setNotice("Published to the open channel."); queryClient.invalidateQueries({ queryKey: ["posts"] }); } });
  const goTo = (next: PageKey) => { if (window.location.hash !== `#${next}`) window.location.hash = next; setPage(next); setMenuOpen(false); setSearch(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const setGenre = (value: string) => { if (page !== "home") setSelectedGenre((current) => ({ ...current, [page]: value })); };
  const filteredChannels = useMemo(() => { const q = guideSearch.trim().toLowerCase(); const source = selectedGenre.guide; return [...channels.filter((c) => (source === "All" || c.source === source) && (!q || `${c.number} ${c.name} ${c.source} ${c.meta} ${guidePrograms[c.source].join(" ")}`.toLowerCase().includes(q)))].sort((a,b) => a.number-b.number); }, [guideSearch, selectedGenre.guide]);
  const searchResults = useMemo(() => { const q = search.trim().toLowerCase(); if (!q) return []; const catalog = [{ name: "Midnight Orbit", page: "movies" }, { name: "Glass Harbor", page: "movies" }, { name: "The Long Room", page: "movies" }, ...tvCatalog.map((item) => ({ name: item.title, page: "tv-shows" })), ...radioStations.map((item) => ({ name: item.name, page: "radio" as PageKey })), { name: "House Lights", page: "theater" }, { name: "Frequency 03", page: "podcast" }, ...trailers.filter((item) => item.genre !== "Commercial").map((item) => ({ name: item.title, page: "trailers" as PageKey })), ...commercials.map((item) => ({ name: item.title, page: "commercials" as PageKey }))] as { name: string; page: PageKey }[]; return catalog.filter((item) => item.name.toLowerCase().includes(q)).slice(0,7); }, [search]);
  const handleFile = async (file?: File) => { if (!file) return; if (file.size > 20 * 1024 * 1024) return setNotice("Choose an image or video smaller than 20 MB."); if (!/^(image\/(jpeg|png|gif|webp)|video\/(mp4|webm|quicktime))$/.test(file.type)) return setNotice("Choose a JPG, PNG, GIF, WebP, MP4, WebM, or MOV file."); const encoded = await fileToBase64(file); const result = await uploadMedia.mutateAsync({ fileName: file.name, mimeType: encoded.mimeType || file.type, dataBase64: encoded.dataBase64 }); if (!result.ok || !result.blobKey || !result.mediaType || !result.fileName) return setNotice(result.error || "Upload failed."); setUpload({ blobKey: result.blobKey, mediaType: result.mediaType, fileName: result.fileName, preview: URL.createObjectURL(file) }); setNotice("Media attached. Publish when you’re ready."); };
  const account = session.data?.account; const signedIn = session.data?.signedIn === true; const genre = page === "home" ? "All" : selectedGenre[page];
  const filteredPosts = (posts.data?.posts || []).filter((post) => genre === "All" || post.topic === genre);
  const recentUploads = (posts.data?.posts || []).filter((post) => Boolean(post.mediaUrl)).slice(0, 6);
  const heroChannels = channels.slice(0, 5);
  const heroChannel = heroChannels.find((channel) => channel.number === heroChannelNumber) || heroChannels[0]!;
  const heroListing = getGuideListing(heroChannel, currentTime);

  return <div className="app-shell"><SafeAreaTopScrim backgroundColor="rgba(11,13,12,.96)"/>
    <nav className="topnav" aria-label="Primary navigation"><button className="brand-mark" aria-label="Go home" onClick={() => goTo("home")}><i/><i/></button><div className={`navlinks ${menuOpen ? "open" : ""}`}>{navItems.map((item) => <button key={item.page} aria-current={page === item.page ? "page" : undefined} onClick={() => goTo(item.page)}>{item.label}</button>)}</div><div className="nav-actions"><div className="global-search"><Icon name="search"/><input aria-label="Search all Reelwave titles" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search all Reelwave titles"/>{search && <div className="search-results">{searchResults.length ? searchResults.map((result) => <button key={`${result.page}-${result.name}`} onClick={() => goTo(result.page)}>{result.name}</button>) : <p>No matching titles.</p>}</div>}</div><button className="contribute" onClick={() => goTo("community")}>Contribute</button><button className="account-button" onClick={() => setAccountOpen(!accountOpen)}><Icon name="user"/><span>{account?.name || "Sign in"}</span></button><button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"}/></button></div>{accountOpen && <div className="account-menu">{signedIn && account ? <><span className="avatar large">{account.initials}</span><strong>{account.name}</strong><p>{account.isOwner ? "Reelwave owner" : "Reelwave member"}</p><button onClick={() => setNotice("Reelwave uses your Muse account. Sign out from the Muse account menu.")}>Sign out</button></> : <><strong>Sign in to Reelwave</strong><p>This private app uses your Muse account. Open it while signed in to continue.</p><button onClick={() => setAccountOpen(false)}>Got it</button></>}</div>}</nav>
    <main>
      {page === "home" && <><section className="guide-hero" aria-labelledby="guide-hero-title">
        <div className="guide-hero-heading">
          <div><p className="eyebrow">Guide preview · 397 channels · Starting at CH 0</p><h1 id="guide-hero-title">The video <em>channel guide</em>.</h1></div>
          <button className="text-link" onClick={() => goTo("guide")}>View all 397 channels <Icon name="arrow"/></button>
        </div>
        <div className="guide-hero-grid">
          <article className="guide-hero-player">
            <video src={heroVideo} controls autoPlay muted loop playsInline preload="metadata" aria-label={`Guide preview for channel ${heroChannel.number}, ${heroChannel.name}`}/>
            <div className="guide-hero-now">
              <div className="guide-hero-channel"><b>CH {heroChannel.number}</b><span>{heroChannel.source}</span></div>
              <div><p>Sample block · {heroListing.currentTime}</p><h2>{heroListing.currentTitle}</h2><strong>{heroChannel.name}</strong></div>
            </div>
            <div className="guide-hero-actions"><span>Next sample · {heroListing.nextTime} — {heroListing.nextTitle}</span><a href={heroChannel.url} target="_blank" rel="noreferrer">Open channel <Icon name="arrow"/></a></div>
          </article>
          <div className="guide-hero-lineup" aria-label="First five channels">
            <div className="guide-hero-lineup-head"><span>Channel</span><span>Sample listing</span></div>
            {heroChannels.map((channel) => { const listing = getGuideListing(channel,currentTime); return <button key={channel.number} className={channel.number === heroChannel.number ? "active" : ""} aria-pressed={channel.number === heroChannel.number} onClick={() => setHeroChannelNumber(channel.number)}><span className="hero-channel-id"><b>CH {channel.number}</b><small>{channel.source}</small></span><span className="hero-channel-program"><strong>{listing.currentTitle}</strong><small>Sample · {listing.currentTime}</small><i>{channel.name}</i></span><Icon name="play"/></button>; })}
            <button className="guide-hero-more" onClick={() => goTo("guide")}>Continue through CH 396 <Icon name="arrow"/></button>
          </div>
        </div>
      </section><section className="recent-uploads" aria-labelledby="recent-uploads-title"><div className="recent-uploads-head"><div><p className="eyebrow">Open channel</p><h2 id="recent-uploads-title">Recently uploaded <em>by users</em></h2></div><button className="text-link" onClick={() => goTo("community")}>See the community <Icon name="arrow"/></button></div>{posts.isPending ? <p className="recent-uploads-empty">Loading recent uploads…</p> : recentUploads.length ? <div className="recent-uploads-grid">{recentUploads.map((post) => <RecentUploadCard key={post.id} post={post}/>)}</div> : <div className="recent-uploads-empty"><h3>No uploads yet.</h3><p>Share the first image or video in the community channel.</p><button className="primary" onClick={() => goTo("community")}><Icon name="upload"/>Add an upload</button></div>}</section><section className="home-directory" aria-label="Browse Reelwave"><p className="eyebrow">Browse by destination</p><div>{navItems.filter((item) => item.page !== "home").map((item, index) => <button key={item.page} onClick={() => goTo(item.page)}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item.label}</strong><Icon name="arrow"/></button>)}</div></section><section className="home-radio" aria-labelledby="home-radio-title"><div className={`home-radio-feature radio-${selectedStation.color}`}><p className="eyebrow pale">Reelwave Radio · RW {String(radioStations.indexOf(selectedStation)+1).padStart(2,"0")}</p><h2 id="home-radio-title">Stay on the <em>signal</em>.</h2><div className="home-radio-now"><span>On the schedule</span><strong>{selectedStation.show}</strong><p>{selectedStation.host} · {selectedStation.genre}</p></div><button className="light-button" onClick={() => goTo("radio")}>Open Radio <Icon name="arrow"/></button></div><div className="home-radio-stations"><p className="eyebrow">Choose a station</p>{radioStations.map((station, index) => <button key={station.id} className={station.id === selectedStation.id ? "active" : ""} aria-pressed={station.id === selectedStation.id} onClick={() => setSelectedStation(station)}><span>RW {String(index+1).padStart(2,"0")}</span><strong>{station.name}</strong><small>{station.show}</small></button>)}</div></section></>}
      {page !== "home" && <PageHeader page={page} genre={genre} setGenre={setGenre}/>} 
      {page === "movies" && <section className="content-section routed-section"><SectionHead number="Now browsing" title="Watch" accent="next"/><div className="poster-rail">{movieCatalog.filter((item) => genre === "All" || item.genre === genre).map((item) => <PosterCard key={item.title} eyebrow={`${item.eyebrow} · ${item.genre}`} title={item.title} subtitle={item.subtitle} tone={item.tone}/>)}</div>{!movieCatalog.some((item) => genre === "All" || item.genre === genre) && <p className="catalog-empty">No {genre.toLowerCase()} movies are in the catalog yet.</p>}</section>}
      {page === "tv-shows" && <><section className="content-section routed-section"><SectionHead number={`${tvCatalog.filter((item) => genre === "All" || item.genre === genre).length} titles`} title="TV show" accent="catalog"/><div className="title-catalog">{tvCatalog.filter((item) => genre === "All" || item.genre === genre).map((show) => <article key={show.title}><p className="eyebrow">{show.genre} · {show.meta}</p><h2>{show.title}</h2><p>{show.description}</p>{show.title === "Cold Case Capital" && <button className="primary" onClick={() => goTo("trailers")}><Icon name="play"/>Watch episode</button>}{show.title === "Badge of Honor" && <button className="ghost" onClick={() => setSelectedDrama(microDramas[0]!)}><Icon name="play"/>Watch teaser</button>}</article>)}</div></section>{(genre === "All" || genre === "Micro Drama") && <section className="content-section micro-section"><SectionHead number="Micro Drama" title="Big drama," accent="short form"/><div className="micro-grid">{microDramas.map((drama) => <button key={drama.title} className="micro-card" onClick={() => setSelectedDrama(drama)} aria-label={`Open ${drama.title} details`}><span className="micro-poster"><img src={drama.poster} alt={`${drama.title} poster artwork`}/><i><Icon name="play"/></i></span><span className="micro-copy"><strong>{drama.title}</strong><small>{drama.label}</small></span></button>)}</div></section>}</>}
      {page === "music" && <section className="content-section routed-section"><SectionHead number="Music catalog" title="Hear the" accent="collection"/><div className="title-catalog">{["Ambient","Soundtrack","Live Session","Talk"].filter((item) => genre === "All" || genre === item).map((item) => <article key={item}><p className="eyebrow">{item}</p><h2>{item === "Ambient" ? "Night Signal selections" : item === "Soundtrack" ? "Reelwave Scores" : item === "Live Session" ? "The Room Sessions" : "Artist Notes"}</h2><p>{item === "Ambient" ? "Low-lit listening for late hours." : item === "Soundtrack" ? "Themes and cues made for the screen." : item === "Live Session" ? "Performances recorded in the room." : "Conversations with the people behind the sound."}</p><button className="ghost" onClick={() => setNotice(`${item} collection selected.`)}>Open collection <Icon name="arrow"/></button></article>)}</div></section>}
      {page === "radio" && <section className="radio-page routed-split"><article className={`radio-card radio-feature radio-${selectedStation.color}`}><p className="eyebrow pale">{selectedStation.genre} · Reelwave Radio</p><h2>{selectedStation.name} <em>Radio</em></h2><div className={`waveform ${radioPlaying ? "active" : ""}`} aria-hidden="true">{Array.from({length:36},(_,i)=><i key={i} style={{height:`${18+((i*17)%54)}%`}}/>)}</div><div><p className="radio-now-label">Selected show</p><h3>{selectedStation.show} with {selectedStation.host}</h3><p>{selectedStation.description}</p><button className="light-button" onClick={() => setRadioPlaying(!radioPlaying)} aria-pressed={radioPlaying}>{radioPlaying ? "Pause preview" : "Play preview"}<Icon name="play"/></button></div></article><div className="radio-lineup"><div className="radio-lineup-head"><p className="eyebrow">Station lineup</p><h2>Choose a signal</h2><p>Select a station to load its show in the player.</p></div><div className="station-list">{radioStations.filter((station) => genre === "All" || station.genre === genre).map((station) => <button key={station.id} className={selectedStation.id === station.id ? "active" : ""} aria-pressed={selectedStation.id === station.id} onClick={() => { setSelectedStation(station); setRadioPlaying(false); }}><span className="station-channel">RW {String(radioStations.indexOf(station)+1).padStart(2,"0")}</span><span><strong>{station.name}</strong><small>{station.show} · {station.host}</small></span><Icon name="arrow"/></button>)}</div>{!radioStations.some((station) => genre === "All" || station.genre === genre) && <p className="catalog-empty">No {genre.toLowerCase()} stations are listed yet.</p>}</div></section>}
      {page === "theater" && <section className="content-section routed-section"><article className="theater-card"><div className="stage-light"/><div><p className="eyebrow">New Work · Drama · Oct 12</p><h3>House Lights</h3><p>An intimate new work about who we become when the audience leaves.</p><button className="ghost" onClick={() => setNotice("House Lights is saved as a live discovery.")}>Explore show <Icon name="arrow"/></button></div></article>{genre !== "All" && genre !== "New Work" && genre !== "Drama" && <p className="catalog-empty">No {genre.toLowerCase()} productions are listed yet.</p>}</section>}
      {page === "podcast" && <section className="split-band routed-split"><article className="podcast-card"><p className="eyebrow">Culture · Reelwave original podcast</p><span className="episode">EP 03 · 42 min</span><h2>Frequency <em>03</em></h2><p>Why certain stories stay with us—and what they change while they’re there.</p><button className="listen" onClick={() => setPodPlaying(!podPlaying)}>{podPlaying ? "Pause episode" : "Listen now"}<span/></button>{podPlaying && <div className="pod-progress"><i/><small>Playing preview</small></div>}</article><article className="music-list"><p className="eyebrow">Podcast genres</p>{["Culture","Film","Music","Interviews"].filter((item) => genre === "All" || genre === item).map((item) => <button key={item} onClick={() => setNotice(`${item} podcast collection selected.`)}><strong>{item}</strong><span>{item === "Culture" ? "Frequency 03" : `${item} collection`}</span><Icon name="arrow"/></button>)}</article></section>}
      {page === "trailers" && <section className="content-section routed-section"><SectionHead number={`${trailers.filter((item) => genre === "All" || item.genre === genre).length} playable videos`} title="Watch" accent="now"/><div className="featured-video-grid">{trailers.filter((item) => genre === "All" || item.genre === genre).map((item) => <article className="featured-video" key={item.title}><video src={item.src} controls playsInline preload="metadata" poster={"poster" in item ? item.poster : undefined} aria-label={`Play ${item.title}`}/><div><p className="eyebrow">{item.genre} · {item.label}</p><h3>{item.title}</h3><p>Select play to watch in the Reelwave player.</p></div></article>)}</div></section>}
      {page === "commercials" && <section className="content-section routed-section"><SectionHead number={`${commercials.filter((item) => genre === "All" || item.category === genre).length} playable spots`} title="Commercial" accent="break"/><div className="featured-video-grid">{commercials.filter((item) => genre === "All" || item.category === genre).map((item) => <article className="featured-video commercial-video" key={item.title}><video src={item.src} controls playsInline preload="metadata" aria-label={`Play ${item.title} commercial`}/><div><p className="eyebrow">{item.category} · {item.label}</p><h3>{item.title}</h3><p>Select play to watch the complete commercial.</p></div></article>)}</div></section>}
      {page === "guide" && <section className="guide-section routed-section"><div className="guide-controls"><label htmlFor="guide-search">Find a channel or show</label><div><Icon name="search"/><input id="guide-search" type="search" value={guideSearch} onChange={(e) => setGuideSearch(e.target.value)} placeholder="Search channel, title, or handle"/></div><p>{filteredChannels.length} of 397 channels</p></div><div className="guide-key"><span>Channel</span><span>Sample listing</span><span>Next sample</span></div><p className="guide-note">Times and program titles are an editorial schedule preview, not live channel data. Select a row to open the channel.</p><div className="guide-list" aria-live="polite">{filteredChannels.length ? filteredChannels.map((channel) => { const listing = getGuideListing(channel,currentTime); return <div key={channel.number}>{(channel.number===0||channel.number===25||channel.number===396) && <h3 className="guide-group">{channel.source === "Facebook" ? "Facebook groups · CH 0–24" : channel.source === "Instagram" ? "Instagram follows · CH 25–395" : "YouTube · CH 396"}</h3>}<a className="channel-row" href={channel.url} target="_blank" rel="noreferrer" aria-label={`Channel ${channel.number}, ${channel.name}. Sample listing ${listing.currentTitle}, ${listing.currentTime}. Next sample ${listing.nextTitle}, ${listing.nextTime}.`}><span className="channel-identity"><b className="channel-number">CH {channel.number}</b><span className="channel-name"><strong>{channel.name}</strong><small>{channel.meta} · {channel.source}</small></span></span><span className="program-slot current"><small>Sample · {listing.currentTime}</small><strong>{listing.currentTitle}</strong></span><span className="program-slot next"><small>Next sample · {listing.nextTime}</small><strong>{listing.nextTitle}</strong></span><Icon name="arrow"/></a></div>; }) : <div className="guide-empty">No channels or shows match “{guideSearch}”.</div>}</div></section>}
      {page === "community" && <section className="community routed-section"><div className="community-grid"><div className="composer">{signedIn && account ? <><div className="composer-account"><span className="avatar">{account.initials}</span><div><strong>{account.name}</strong><p>Posting to the open channel</p></div></div><label htmlFor="composer-topic">Topic</label><select id="composer-topic" value={topic} onChange={(e)=>setTopic(e.target.value as typeof topic)}>{topics.map((item)=><option key={item}>{item}</option>)}</select><label htmlFor="composer-note">Your note</label><textarea id="composer-note" value={note} onChange={(e)=>setNote(e.target.value.slice(0,280))} maxLength={280} placeholder="What’s worth watching, hearing, or seeing?"/><div className="composer-count">{note.length} / 280</div>{upload && <div className="upload-preview">{upload.mediaType.startsWith("image/")?<img src={upload.preview} alt={`Preview of ${upload.fileName}`}/>:<video src={upload.preview} controls playsInline aria-label={`Preview of ${upload.fileName}`}/>}<div><strong>{upload.fileName}</strong><button onClick={()=>{URL.revokeObjectURL(upload.preview);setUpload(null);}}>Remove</button></div></div>}<input ref={fileRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime" aria-label="Choose image or video" onChange={(e)=>handleFile(e.target.files?.[0])}/><div className="composer-actions"><button className="upload-button" onClick={()=>fileRef.current?.click()} disabled={uploadMedia.isPending}><Icon name="upload"/>{uploadMedia.isPending?"Uploading…":"Media upload"}</button><button className="publish-button" onClick={()=>publish.mutate()} disabled={!note.trim()||publish.isPending}>{publish.isPending?"Publishing…":"Publish"}</button></div></>:<div className="signin-prompt"><Icon name="user"/><h3>Join the open channel</h3><p>Sign in with your Muse account to upload media and publish.</p><button onClick={()=>setAccountOpen(true)}>Sign in</button></div>}</div><div className="feed" aria-label="Community posts">{posts.isPending?<p className="feed-empty">Loading the channel…</p>:filteredPosts.length?filteredPosts.map((post)=><FeedPost key={post.id} post={post}/>):<div className="feed-empty"><span/><h3>The channel is quiet.</h3><p>{genre === "All" ? "Be the first to send a good story traveling." : `No ${genre.toLowerCase()} posts yet.`}</p></div>}</div></div></section>}
    </main>
    <footer><div className="footer-statement"><h2>Screen, stage, and sound. <em>Carefully chosen.</em></h2><p>© 2026 Reelwave Entertainment</p></div><div><p className="eyebrow">Browse</p>{navItems.slice(1,4).map((item)=><button key={item.page} onClick={()=>goTo(item.page)}>{item.label}</button>)}</div><div><p className="eyebrow">Watch</p>{navItems.slice(4,7).map((item)=><button key={item.page} onClick={()=>goTo(item.page)}>{item.label}</button>)}</div><div><p className="eyebrow">Join</p>{navItems.slice(7).map((item)=><button key={item.page} onClick={()=>goTo(item.page)}>{item.label}</button>)}</div></footer>
    {selectedDrama && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="micro-detail-title" onClick={()=>setSelectedDrama(null)}><div className="micro-modal" onClick={(e)=>e.stopPropagation()}><button className="modal-close" aria-label="Close micro drama details" onClick={()=>setSelectedDrama(null)}><Icon name="close"/></button>{selectedDrama.teaser?<video className="micro-teaser" src={selectedDrama.teaser} controls playsInline preload="metadata" poster={selectedDrama.poster} aria-label={`Play ${selectedDrama.title} teaser`}/>:<img src={selectedDrama.poster} alt={`${selectedDrama.title} poster artwork`}/>}<div className="micro-detail"><p className="eyebrow">Micro Drama · {selectedDrama.label}</p><h2 id="micro-detail-title">{selectedDrama.title}</h2><p>{selectedDrama.teaser?"Watch the official teaser in the Reelwave player.":"Trailer details will appear here when a video is added."}</p></div></div></div>}
    {notice && <div className="toast" role="status"><span>{notice}</span><button aria-label="Dismiss message" onClick={()=>setNotice("")}><Icon name="close"/></button></div>}
  </div>;
}
