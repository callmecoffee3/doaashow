import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fileToBase64, SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { api, type ApiResponse } from "./api";

type AppData = ApiResponse<typeof api, "getAppData">;
type Profile = AppData["profiles"][number];
type View = "feed" | "market" | "create" | "community" | "notifications" | "profile";
type CommunityTab = "people" | "groups" | "events";
type CreateMode = "post" | "listing" | "group" | "event";

type Upload = { dataBase64: string; mimeType: "image/jpeg" | "image/png"; preview: string } | null;

function Icon({ name, filled = false }: { name: "home" | "market" | "plus" | "people" | "bell" | "heart" | "camera" | "calendar" | "group" | "back" | "check"; filled?: boolean }) {
  const common = { fill: filled ? "currentColor" : "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5M9 21v-7h6v7"/></>,
    market: <><path d="M4 9h16l-1.5-5h-13z"/><path d="M5 9v11h14V9M8 13h8"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    people: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 20c.3-4 2-6 5.5-6s5.2 2 5.5 6M14 15c3.7-.6 6 1 6.5 4"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    heart: <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>,
    camera: <><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    group: <><path d="M4 20v-9l8-5 8 5v9"/><path d="M9 20v-5h6v5"/></>,
    back: <><path d="m15 18-6-6 6-6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon" {...common}>{paths[name]}</svg>;
}

function Avatar({ profile, size = "md" }: { profile?: Profile; size?: "sm" | "md" | "lg" }) {
  const initials = profile?.name.split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase() || "?";
  return <div className={`avatar avatar-${size}`} aria-hidden="true">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : <span>{initials}</span>}</div>;
}

function relativeTime(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(iso));
}

function formatEvent(iso: string) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <div className="empty"><span className="empty-mark"/><h2>{title}</h2><p>{body}</p>{action}</div>;
}

function ImagePicker({ upload, onChange, label = "Add a photo" }: { upload: Upload; onChange: (v: Upload) => void; label?: string }) {
  const id = useMemo(() => `image-${Math.random().toString(36).slice(2)}`, []);
  const choose = async (file?: File) => {
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/png") return;
    const encoded = await fileToBase64(file);
    onChange({ dataBase64: encoded.dataBase64, mimeType: encoded.mimeType as "image/jpeg" | "image/png", preview: URL.createObjectURL(file) });
  };
  return <div className="image-picker">
    {upload ? <div className="image-preview"><img src={upload.preview} alt="Selected upload preview"/><button type="button" className="remove-image" onClick={() => onChange(null)}>Remove</button></div> : null}
    <label htmlFor={id} className="upload-button"><Icon name="camera"/>{upload ? "Choose another" : label}</label>
    <input id={id} hidden type="file" accept="image/jpeg,image/png" onChange={e => choose(e.target.files?.[0])}/>
  </div>;
}

export function App() {
  const queryClient = useQueryClient();
  const dataQuery = useQuery({ queryKey: ["social-data"], queryFn: () => api.getAppData({}) });
  const [activeId, setActiveId] = useState<number | null>(() => Number(localStorage.getItem("social-active-profile")) || null);
  const [view, setView] = useState<View>("feed");
  const [previousView, setPreviousView] = useState<View>("feed");
  const [communityTab, setCommunityTab] = useState<CommunityTab>("people");
  const [createMode, setCreateMode] = useState<CreateMode>("post");
  const [viewedProfileId, setViewedProfileId] = useState<number | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileEditorCreate, setProfileEditorCreate] = useState(false);
  const [toast, setToast] = useState("");
  const data = dataQuery.data;
  const active = data?.profiles.find(p => p.id === activeId) ?? data?.profiles[0];

  useEffect(() => {
    if (!data) return;
    if (data.profiles.length > 0 && (!activeId || !data.profiles.some(p => p.id === activeId))) {
      setActiveId(data.profiles[0]?.id ?? null);
    }
  }, [data, activeId]);
  useEffect(() => {
    if (activeId) localStorage.setItem("social-active-profile", String(activeId));
  }, [activeId]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["social-data"] });
  const openCreate = (mode: CreateMode) => {
    if (!active) {
      setProfileEditorCreate(true);
      setShowOnboarding(true);
      return;
    }
    setCreateMode(mode);
    setPreviousView(view === "create" ? "feed" : view);
    setView("create");
  };
  const navigate = (next: View) => { setShowProfileMenu(false); setView(next); };

  if (dataQuery.isPending) return <div className="loading"><span/><span/><span/><p>Opening your community</p></div>;
  if (dataQuery.error || !data) return <main className="center-state"><h1>Couldn’t open the community</h1><p>Try loading it again.</p><button onClick={() => dataQuery.refetch()}>Retry</button></main>;

  const profileById = (id: number) => data.profiles.find(p => p.id === id);
  const unread = active ? data.notifications.filter(n => n.profile_id === active.id && !n.is_read).length : 0;

  return <div className="app-shell">
    <SafeAreaTopScrim backgroundColor="var(--bg)" />
    <header className="topbar">
      {view === "create" ? <button className="icon-button" aria-label="Close create panel" onClick={() => setView(previousView)}><Icon name="back"/></button> : <div className="section-title">{view === "feed" ? "For you" : view === "market" ? "Marketplace" : view === "community" ? "Community" : view === "notifications" ? "Activity" : "Profile"}</div>}
      {view === "create" ? <div className="section-title">Create</div> : null}
      <button className="profile-switch" aria-label="Open profile menu" onClick={() => setShowProfileMenu(v => !v)}><Avatar profile={active}/></button>
      {showProfileMenu ? <div className="profile-menu">
        <p className="menu-label">Posting as</p>
        {data.profiles.map(p => <button key={p.id} className={p.id === active?.id ? "selected-profile" : ""} onClick={() => { setActiveId(p.id); setShowProfileMenu(false); }}><Avatar profile={p} size="sm"/><span><b>{p.name}</b><small>@{p.handle}</small></span>{p.id === active?.id ? <Icon name="check"/> : null}</button>)}
        <button className="add-profile" onClick={() => { setProfileEditorCreate(true); setShowProfileMenu(false); setShowOnboarding(true); }}>+ Add a profile</button>
        {active ? <button onClick={() => { setViewedProfileId(active.id); setShowProfileMenu(false); navigate("profile"); }}>View profile</button> : null}
      </div> : null}
    </header>

    <main className="main-content">
      {view === "feed" && <Feed data={data} active={active} profileById={profileById} onCreate={() => openCreate("post")} refresh={refresh} onToast={setToast} onProfile={(id) => { setViewedProfileId(id); setView("profile"); }}/>} 
      {view === "market" && <Marketplace data={data} active={active} profileById={profileById} onSell={() => openCreate("listing")} refresh={refresh} onToast={setToast}/>} 
      {view === "community" && <Community data={data} active={active} tab={communityTab} setTab={setCommunityTab} profileById={profileById} onCreate={openCreate} refresh={refresh} onToast={setToast}/>} 
      {view === "notifications" && <Notifications data={data} active={active} profileById={profileById} refresh={refresh}/>} 
      {view === "profile" && active && <ProfileView data={data} viewer={active} profile={data.profiles.find(p => p.id === viewedProfileId) ?? active} refresh={refresh} onEdit={() => { setProfileEditorCreate(false); setShowOnboarding(true); }}/>} 
      {view === "create" && active && <CreatePanel mode={createMode} setMode={setCreateMode} active={active} refresh={refresh} onDone={(message) => { setToast(message); setView(createMode === "listing" ? "market" : createMode === "post" ? "feed" : "community"); }}/>} 
    </main>

    {view !== "create" ? <nav className="bottom-nav" aria-label="Primary navigation">
      <NavButton label="Home" icon="home" active={view === "feed"} onClick={() => navigate("feed")}/>
      <NavButton label="Market" icon="market" active={view === "market"} onClick={() => navigate("market")}/>
      <button className="create-nav" aria-label="Create" onClick={() => openCreate("post")}><Icon name="plus"/></button>
      <NavButton label="Community" icon="people" active={view === "community"} onClick={() => navigate("community")}/>
      <NavButton label="Activity" icon="bell" active={view === "notifications"} badge={unread} onClick={() => navigate("notifications")}/>
    </nav> : null}

    {showOnboarding ? <ProfileEditor existing={active && data.profiles.length > 0 ? active : undefined} forceCreate={data.profiles.length === 0} startNew={profileEditorCreate} refresh={refresh} onClose={(id) => { if (id) setActiveId(id); if (data.profiles.length > 0 || id) setShowOnboarding(false); }} onToast={setToast}/> : null}
    {toast ? <div className="toast" role="status">{toast}</div> : null}
  </div>;
}

function NavButton({ label, icon, active, badge, onClick }: { label: string; icon: "home" | "market" | "people" | "bell"; active: boolean; badge?: number; onClick: () => void }) {
  return <button className={active ? "nav-active" : ""} aria-label={label} aria-current={active ? "page" : undefined} onClick={onClick}><span className="nav-icon"><Icon name={icon} filled={active}/>{badge ? <i>{badge > 9 ? "9+" : badge}</i> : null}</span><small>{label}</small></button>;
}

function Feed({ data, active, profileById, onCreate, refresh, onToast, onProfile }: { data: AppData; active?: Profile; profileById: (id: number) => Profile | undefined; onCreate: () => void; refresh: () => void; onToast: (s: string) => void; onProfile: (id: number) => void }) {
  const like = useMutation({ mutationFn: ({ postId, profileId }: { postId: number; profileId: number }) => api.toggleLike({ postId, profileId }), onSuccess: refresh });
  const follows = active ? new Set(data.follows.filter(f => f.follower_id === active.id).map(f => f.following_id)) : new Set<number>();
  const visible = active ? data.posts.filter(p => p.profile_id === active.id || follows.has(p.profile_id) || follows.size === 0) : data.posts;
  return <div className="feed-layout">
    <section className="feed-column">
      <button className="composer" onClick={onCreate}><Avatar profile={active}/><span>{active ? "Share a photo or a thought…" : "Create a profile to start sharing"}</span><Icon name="camera"/></button>
      {visible.length === 0 ? <Empty title={active ? "Your feed starts here" : "Welcome to your community"} body={active ? "Share the first photo, or follow another profile to see their posts." : "Create a profile, then share photos, browse Marketplace, join groups, and make plans."} action={<button className="primary" onClick={onCreate}>{active ? "Create a post" : "Create your profile"}</button>}/> : visible.map(post => {
        const author = profileById(post.profile_id);
        const liked = !!active && post.liked_by.includes(active.id);
        return <article className="post" key={post.id}>
          <div className="post-head"><button className="author" onClick={() => onProfile(post.profile_id)}><Avatar profile={author}/><span><b>{author?.name ?? "Unknown profile"}</b><small>@{author?.handle ?? "unknown"} · {relativeTime(post.created_at)}</small></span></button></div>
          {post.caption ? <p className="caption">{post.caption}</p> : null}
          {post.image_url ? <img className="post-image" src={post.image_url} alt={post.caption || `Photo shared by ${author?.name ?? "a member"}`}/> : null}
          <div className="post-actions"><button className={liked ? "liked" : ""} aria-label={liked ? "Unlike post" : "Like post"} onClick={() => active ? like.mutate({ postId: post.id, profileId: active.id }) : onToast("Choose a profile first")}><Icon name="heart" filled={liked}/><span>{post.liked_by.length || "Like"}</span></button><span>{relativeTime(post.created_at)}</span></div>
        </article>;
      })}
    </section>
    <aside className="feed-aside"><p className="aside-title">People to discover</p>{data.profiles.filter(p => p.id !== active?.id && !follows.has(p.id)).slice(0, 4).map(p => <button key={p.id} onClick={() => onProfile(p.id)}><Avatar profile={p}/><span><b>{p.name}</b><small>@{p.handle}</small></span></button>)}{data.profiles.length <= 1 ? <p className="aside-empty">More profiles will appear here as people join.</p> : null}</aside>
  </div>;
}

function Marketplace({ data, active, profileById, onSell, refresh, onToast }: { data: AppData; active?: Profile; profileById: (id: number) => Profile | undefined; onSell: () => void; refresh: () => void; onToast: (s: string) => void }) {
  const [filter, setFilter] = useState("All");
  const sold = useMutation({ mutationFn: (id: number) => api.markListingSold({ listingId: id, sellerId: active!.id }), onSuccess: () => { refresh(); onToast("Listing marked sold"); } });
  const categories = ["All", ...Array.from(new Set(data.listings.map(l => l.category)))];
  const listings = data.listings.filter(l => filter === "All" || l.category === filter);
  return <section className="market-page">
    <div className="market-intro"><div><h1>Find something worth keeping.</h1><p>Browse what your community is selling.</p></div><button className="primary" onClick={onSell}>Sell an item</button></div>
    {categories.length > 1 ? <div className="filter-row" aria-label="Listing categories">{categories.map(c => <button key={c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>)}</div> : null}
    {listings.length === 0 ? <Empty title="Nothing listed yet" body="Post the first item for your community to discover." action={<button className="primary" onClick={onSell}>Create a listing</button>}/> : <div className="listing-grid">{listings.map(item => {
      const seller = profileById(item.seller_id);
      return <article className={`listing ${item.status === "sold" ? "is-sold" : ""}`} key={item.id}>
        <div className="listing-image">{item.image_url ? <img src={item.image_url} alt={item.title}/> : <Icon name="market"/>}{item.status === "sold" ? <span className="sold-label">Sold</span> : null}</div>
        <div className="listing-copy"><div className="price">{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(item.price_cents / 100)}</div><h2>{item.title}</h2><p>{item.item_condition} · {item.category}</p><div className="seller"><Avatar profile={seller} size="sm"/><span>{seller?.name ?? "Unknown seller"}</span></div>{active?.id === item.seller_id && item.status === "available" ? <button className="text-button" onClick={() => sold.mutate(item.id)}>Mark as sold</button> : null}</div>
      </article>;
    })}</div>}
  </section>;
}

function Community({ data, active, tab, setTab, profileById, onCreate, refresh, onToast }: { data: AppData; active?: Profile; tab: CommunityTab; setTab: (t: CommunityTab) => void; profileById: (id: number) => Profile | undefined; onCreate: (m: CreateMode) => void; refresh: () => void; onToast: (s: string) => void }) {
  const follow = useMutation({ mutationFn: (id: number) => api.toggleFollow({ followerId: active!.id, followingId: id }), onSuccess: refresh });
  const friend = useMutation({ mutationFn: (id: number) => api.requestFriend({ requesterId: active!.id, addresseeId: id }), onSuccess: () => { refresh(); onToast("Friend request sent"); } });
  const accept = useMutation({ mutationFn: (id: number) => api.acceptFriend({ friendshipId: id, profileId: active!.id }), onSuccess: () => { refresh(); onToast("You’re now friends"); } });
  const membership = useMutation({ mutationFn: (id: number) => api.toggleGroupMembership({ groupId: id, profileId: active!.id }), onSuccess: refresh });
  const rsvp = useMutation({ mutationFn: (id: number) => api.toggleRsvp({ eventId: id, profileId: active!.id }), onSuccess: refresh });
  const follows = new Set(data.follows.filter(f => f.follower_id === active?.id).map(f => f.following_id));
  const relationship = (id: number) => data.friendships.find(f => (f.requester_id === active?.id && f.addressee_id === id) || (f.addressee_id === active?.id && f.requester_id === id));
  return <section className="community-page">
    <div className="segmented">{(["people", "groups", "events"] as CommunityTab[]).map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}</div>
    {tab === "people" && <div className="people-list">{data.profiles.filter(p => p.id !== active?.id).length === 0 ? <Empty title="It’s quiet here" body="Add another profile to start following and making friends."/> : data.profiles.filter(p => p.id !== active?.id).map(p => { const rel = relationship(p.id); return <article className="person-row" key={p.id}><Avatar profile={p} size="lg"/><div className="person-copy"><h2>{p.name}</h2><p>@{p.handle}</p>{p.bio ? <small>{p.bio}</small> : null}</div><div className="person-actions"><button className={follows.has(p.id) ? "secondary" : "primary"} onClick={() => active && follow.mutate(p.id)}>{follows.has(p.id) ? "Following" : "Follow"}</button>{rel?.status === "pending" && rel.addressee_id === active?.id ? <button className="secondary" onClick={() => accept.mutate(rel.id)}>Accept</button> : <button className="text-button" disabled={!!rel} onClick={() => active && friend.mutate(p.id)}>{rel?.status === "accepted" ? "Friends" : rel ? "Requested" : "Add friend"}</button>}</div></article>; })}</div>}
    {tab === "groups" && <><div className="section-action"><div><h1>Groups</h1><p>Gather around a shared interest.</p></div><button className="secondary" onClick={() => onCreate("group")}>New group</button></div>{data.groups.length === 0 ? <Empty title="No groups yet" body="Create a place for your community to gather." action={<button className="primary" onClick={() => onCreate("group")}>Create a group</button>}/> : <div className="group-list">{data.groups.map(g => { const joined = !!active && g.member_ids.includes(active.id); return <article className="group-row" key={g.id}><div className="group-mark"><Icon name="group"/></div><div><h2>{g.name}</h2><p>{g.description || "A community group"}</p><small>{g.privacy} · {g.member_ids.length} {g.member_ids.length === 1 ? "member" : "members"}</small></div><button className={joined ? "secondary" : "primary"} onClick={() => active && membership.mutate(g.id)}>{joined ? "Joined" : "Join"}</button></article>; })}</div>}</>}
    {tab === "events" && <><div className="section-action"><div><h1>Events</h1><p>Make plans together.</p></div><button className="secondary" onClick={() => onCreate("event")}>New event</button></div>{data.events.length === 0 ? <Empty title="No plans on the calendar" body="Create the first community event." action={<button className="primary" onClick={() => onCreate("event")}>Create an event</button>}/> : <div className="event-list">{data.events.map(e => { const going = !!active && e.attendee_ids.includes(active.id); const organizer = profileById(e.organizer_id); const d = new Date(e.starts_at); return <article className="event-row" key={e.id}><div className="date-block"><b>{new Intl.DateTimeFormat(undefined, { month: "short" }).format(d)}</b><span>{d.getDate()}</span></div><div><h2>{e.title}</h2><p>{formatEvent(e.starts_at)}{e.location ? ` · ${e.location}` : ""}</p><small>Hosted by {organizer?.name ?? "a member"} · {e.attendee_ids.length} going</small></div><button className={going ? "secondary" : "primary"} onClick={() => active && rsvp.mutate(e.id)}>{going ? "Going" : "RSVP"}</button></article>; })}</div>}</>}
  </section>;
}

function Notifications({ data, active, profileById, refresh }: { data: AppData; active?: Profile; profileById: (id: number) => Profile | undefined; refresh: () => void }) {
  const mark = useMutation({ mutationFn: (id?: number) => api.markNotificationsRead({ profileId: active!.id, notificationId: id }), onSuccess: refresh });
  const items = data.notifications.filter(n => n.profile_id === active?.id);
  return <section className="notifications-page">
    {items.some(n => !n.is_read) ? <button className="mark-read" onClick={() => mark.mutate(undefined)}>Mark all as read</button> : null}
    {items.length === 0 ? <Empty title="All caught up" body="Follows, friend requests, likes, group joins, and RSVPs will appear here."/> : <div className="notification-list">{items.map(n => <button key={n.id} className={`notification ${n.is_read ? "" : "unread"}`} onClick={() => !n.is_read && mark.mutate(n.id)}><Avatar profile={n.actor_id ? profileById(n.actor_id) : undefined}/><span><b>{n.message}</b><small>{relativeTime(n.created_at)}</small></span>{!n.is_read ? <i/> : null}</button>)}</div>}
  </section>;
}

function ProfileView({ data, viewer, profile, refresh, onEdit }: { data: AppData; viewer: Profile; profile: Profile; refresh: () => void; onEdit: () => void }) {
  const posts = data.posts.filter(p => p.profile_id === profile.id);
  const followers = data.follows.filter(f => f.following_id === profile.id).length;
  const following = data.follows.filter(f => f.follower_id === profile.id).length;
  const friends = data.friendships.filter(f => f.status === "accepted" && (f.requester_id === profile.id || f.addressee_id === profile.id)).length;
  const isOwn = viewer.id === profile.id;
  const isFollowing = data.follows.some(f => f.follower_id === viewer.id && f.following_id === profile.id);
  const follow = useMutation({ mutationFn: () => api.toggleFollow({ followerId: viewer.id, followingId: profile.id }), onSuccess: refresh });
  return <section className="profile-page">
    <div className="profile-hero"><Avatar profile={profile} size="lg"/><div><h1>{profile.name}</h1><p>@{profile.handle}</p></div>{isOwn ? <button className="secondary" onClick={onEdit}>Edit profile</button> : <button className={isFollowing ? "secondary" : "primary"} onClick={() => follow.mutate()}>{isFollowing ? "Following" : "Follow"}</button>}</div>
    {profile.bio ? <p className="profile-bio">{profile.bio}</p> : <p className="profile-bio dim">Add a bio to tell people what you’re into.</p>}
    <div className="profile-stats"><span><b>{posts.length}</b> posts</span><span><b>{followers}</b> followers</span><span><b>{following}</b> following</span><span><b>{friends}</b> friends</span></div>
    <h2 className="profile-section-title">Photos & posts</h2>
    {posts.length === 0 ? <Empty title="Nothing shared yet" body="Your photos and posts will collect here."/> : <div className="profile-grid">{posts.map(p => <article key={p.id}>{p.image_url ? <img src={p.image_url} alt={p.caption || `Photo by ${profile.name}`}/> : <div className="text-post">{p.caption}</div>}</article>)}</div>}
  </section>;
}

function CreatePanel({ mode, setMode, active, refresh, onDone }: { mode: CreateMode; setMode: (m: CreateMode) => void; active: Profile; refresh: () => void; onDone: (message: string) => void }) {
  return <section className="create-page">
    <div className="create-tabs">{(["post", "listing", "group", "event"] as CreateMode[]).map(m => <button key={m} className={mode === m ? "active" : ""} onClick={() => setMode(m)}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>)}</div>
    {mode === "post" && <PostForm active={active} refresh={refresh} onDone={onDone}/>} 
    {mode === "listing" && <ListingForm active={active} refresh={refresh} onDone={onDone}/>} 
    {mode === "group" && <GroupForm active={active} refresh={refresh} onDone={onDone}/>} 
    {mode === "event" && <EventForm active={active} refresh={refresh} onDone={onDone}/>} 
  </section>;
}

function PostForm({ active, refresh, onDone }: { active: Profile; refresh: () => void; onDone: (s: string) => void }) {
  const [caption, setCaption] = useState(""); const [upload, setUpload] = useState<Upload>(null); const [error, setError] = useState("");
  const mutation = useMutation({ mutationFn: () => api.createPost({ profileId: active.id, caption, imageBase64: upload?.dataBase64, imageMime: upload?.mimeType }), onSuccess: () => { refresh(); onDone("Post shared"); }, onError: () => setError("Add a photo or a caption before sharing.") });
  return <form className="editor" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><div className="editor-author"><Avatar profile={active}/><div><b>{active.name}</b><small>@{active.handle}</small></div></div><label htmlFor="post-caption">Caption</label><textarea id="post-caption" rows={5} maxLength={1200} value={caption} onChange={e => setCaption(e.target.value)} placeholder="What do you want to share?"/><ImagePicker upload={upload} onChange={setUpload}/>{error ? <p className="form-error">{error}</p> : null}<button className="primary wide" disabled={mutation.isPending}>{mutation.isPending ? "Sharing…" : "Share post"}</button></form>;
}

function ListingForm({ active, refresh, onDone }: { active: Profile; refresh: () => void; onDone: (s: string) => void }) {
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [price, setPrice] = useState(""); const [category, setCategory] = useState(""); const [condition, setCondition] = useState<"New" | "Like new" | "Good" | "Fair">("Good"); const [upload, setUpload] = useState<Upload>(null); const [error, setError] = useState("");
  const mutation = useMutation({ mutationFn: () => api.createListing({ sellerId: active.id, title, description, priceCents: Math.round(Number(price) * 100), category, itemCondition: condition, imageBase64: upload?.dataBase64, imageMime: upload?.mimeType }), onSuccess: () => { refresh(); onDone("Listing published"); }, onError: () => setError("Check the title, price, and category.") });
  return <form className="editor" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><h1>List something for sale</h1><label htmlFor="listing-title">Title</label><input id="listing-title" required minLength={2} maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="What are you selling?"/><div className="field-pair"><div><label htmlFor="listing-price">Price</label><div className="price-input"><span>$</span><input id="listing-price" required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00"/></div></div><div><label htmlFor="listing-condition">Condition</label><select id="listing-condition" value={condition} onChange={e => setCondition(e.target.value as typeof condition)}><option>New</option><option>Like new</option><option>Good</option><option>Fair</option></select></div></div><label htmlFor="listing-category">Category</label><input id="listing-category" required minLength={2} maxLength={40} value={category} onChange={e => setCategory(e.target.value)} placeholder="Furniture, cameras, clothing…"/><label htmlFor="listing-description">Description</label><textarea id="listing-description" rows={4} maxLength={500} value={description} onChange={e => setDescription(e.target.value)} placeholder="Add useful details"/><ImagePicker upload={upload} onChange={setUpload} label="Add item photo"/>{error ? <p className="form-error">{error}</p> : null}<button className="primary wide" disabled={mutation.isPending}>{mutation.isPending ? "Publishing…" : "Publish listing"}</button></form>;
}

function GroupForm({ active, refresh, onDone }: { active: Profile; refresh: () => void; onDone: (s: string) => void }) {
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const mutation = useMutation({ mutationFn: () => api.createGroup({ creatorId: active.id, name, description, privacy }), onSuccess: () => { refresh(); onDone("Group created"); } });
  return <form className="editor" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><h1>Start a group</h1><label htmlFor="group-name">Group name</label><input id="group-name" required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Street photographers"/><label htmlFor="group-description">Description</label><textarea id="group-description" rows={4} maxLength={300} value={description} onChange={e => setDescription(e.target.value)} placeholder="What brings this group together?"/><label htmlFor="group-privacy">Privacy</label><select id="group-privacy" value={privacy} onChange={e => setPrivacy(e.target.value as typeof privacy)}><option value="public">Public</option><option value="private">Private</option></select><button className="primary wide" disabled={mutation.isPending}>{mutation.isPending ? "Creating…" : "Create group"}</button></form>;
}

function EventForm({ active, refresh, onDone }: { active: Profile; refresh: () => void; onDone: (s: string) => void }) {
  const [title, setTitle] = useState(""); const [details, setDetails] = useState(""); const [location, setLocation] = useState(""); const [startsAt, setStartsAt] = useState("");
  const mutation = useMutation({ mutationFn: () => api.createEvent({ organizerId: active.id, title, details, location, startsAt: new Date(startsAt).toISOString() }), onSuccess: () => { refresh(); onDone("Event created"); } });
  return <form className="editor" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><h1>Plan an event</h1><label htmlFor="event-title">Event name</label><input id="event-title" required minLength={2} maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="Photo walk"/><label htmlFor="event-date">Date and time</label><input id="event-date" aria-label="Date and time" required type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)}/><label htmlFor="event-location">Location</label><input id="event-location" maxLength={120} value={location} onChange={e => setLocation(e.target.value)} placeholder="Where will you meet?"/><label htmlFor="event-details">Details</label><textarea id="event-details" rows={4} maxLength={500} value={details} onChange={e => setDetails(e.target.value)} placeholder="What should people know?"/><button className="primary wide" disabled={mutation.isPending}>{mutation.isPending ? "Creating…" : "Create event"}</button></form>;
}

function ProfileEditor({ existing, forceCreate, startNew, refresh, onClose, onToast }: { existing?: Profile; forceCreate: boolean; startNew: boolean; refresh: () => void; onClose: (id?: number) => void; onToast: (s: string) => void }) {
  const [isNew, setIsNew] = useState(forceCreate || startNew);
  const [name, setName] = useState(isNew ? "" : existing?.name ?? ""); const [handle, setHandle] = useState(""); const [bio, setBio] = useState(isNew ? "" : existing?.bio ?? ""); const [upload, setUpload] = useState<Upload>(null); const [error, setError] = useState("");
  const create = useMutation({ mutationFn: () => api.createProfile({ name, handle, bio, imageBase64: upload?.dataBase64, imageMime: upload?.mimeType }), onSuccess: r => { refresh(); onToast("Profile created"); onClose(r.id); }, onError: () => setError("That handle may already be taken. Try another one.") });
  const update = useMutation({ mutationFn: () => api.updateProfile({ profileId: existing!.id, name, bio, imageBase64: upload?.dataBase64, imageMime: upload?.mimeType }), onSuccess: () => { refresh(); onToast("Profile updated"); onClose(existing!.id); }, onError: () => setError("Couldn’t update the profile. Try again.") });
  const submit = (e: FormEvent) => { e.preventDefault(); isNew ? create.mutate() : update.mutate(); };
  return <div className="modal-backdrop" role="presentation"><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-editor-title"><div className="modal-head"><div><p>{isNew ? "JOIN THE COMMUNITY" : "YOUR PROFILE"}</p><h1 id="profile-editor-title">{isNew ? "Create your profile" : "Make it yours"}</h1></div>{!forceCreate ? <button className="icon-button" aria-label="Close profile editor" onClick={() => onClose()}><span>×</span></button> : null}</div><form onSubmit={submit}><ImagePicker upload={upload} onChange={setUpload} label={isNew ? "Add profile photo" : "Change profile photo"}/><label htmlFor="profile-name">Name</label><input id="profile-name" required minLength={2} maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/>{isNew ? <><label htmlFor="profile-handle">Handle</label><div className="handle-input"><span>@</span><input id="profile-handle" required minLength={2} maxLength={30} value={handle} onChange={e => setHandle(e.target.value)} placeholder="yourhandle"/></div></> : <div className="locked-handle">@{existing?.handle}</div>}<label htmlFor="profile-bio">Bio</label><textarea id="profile-bio" rows={3} maxLength={180} value={bio} onChange={e => setBio(e.target.value)} placeholder="A little about you"/>{error ? <p className="form-error">{error}</p> : null}<button className="primary wide" disabled={create.isPending || update.isPending}>{create.isPending || update.isPending ? "Saving…" : isNew ? "Create profile" : "Save changes"}</button>{!forceCreate && !isNew ? <button type="button" className="text-button wide" onClick={() => { setIsNew(true); setName(""); setHandle(""); setBio(""); setUpload(null); }}>Create another profile</button> : null}</form></section></div>;
}
