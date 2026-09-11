import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiResponse } from "./api";

type Scope = "all" | "public" | "private";
type Visibility = "public" | "private";
type Post = ApiResponse<typeof api, "listPosts">["posts"][number];

const tabs: Array<{ value: Scope; label: string }> = [
  { value: "all", label: "All notices" },
  { value: "public", label: "Public" },
  { value: "private", label: "Just me" },
];

function formatTime(value: string) {
  const date = new Date(value);
  const now = Date.now();
  const diff = now - date.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(date);
}

function Notice({
  post,
  onChanged,
}: {
  post: Post;
  onChanged: (message: string) => void;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const update = useMutation({
    mutationFn: () => api.updatePost({ id: post.id, body: draft }),
    onSuccess: async (result) => {
      if (!result.ok) return onChanged(result.error);
      setEditing(false);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      onChanged("Notice updated.");
    },
    onError: () => onChanged("The notice could not be updated."),
  });

  const remove = useMutation({
    mutationFn: () => api.deletePost({ id: post.id }),
    onSuccess: async (result) => {
      if (!result.ok) return onChanged(result.error);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      onChanged("Notice removed.");
    },
    onError: () => onChanged("The notice could not be removed."),
  });

  const wasEdited = post.updated_at !== post.created_at;
  const pinClass = `pin pin-${(post.id % 3) + 1}`;

  return (
    <article className={`notice notice-${(post.id % 4) + 1}`}>
      <span className={pinClass} aria-hidden="true" />
      <div className="notice-meta">
        <span className={`visibility-tag ${post.visibility}`}>
          {post.visibility === "public" ? "Public" : "Only me"}
        </span>
        <span>{post.author_name}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.created_at}>{formatTime(post.created_at)}</time>
        {wasEdited ? <span className="edited">edited</span> : null}
      </div>

      {editing ? (
        <div className="edit-area">
          <label className="sr-only" htmlFor={`edit-${post.id}`}>
            Edit notice
          </label>
          <textarea
            id={`edit-${post.id}`}
            value={draft}
            maxLength={500}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
          />
          <div className="edit-footer">
            <span>{draft.length}/500</span>
            <div className="button-row">
              <button
                className="button-quiet"
                type="button"
                onClick={() => {
                  setDraft(post.body);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
              <button
                className="button-primary compact"
                type="button"
                disabled={!draft.trim() || update.isPending}
                onClick={() => update.mutate()}
              >
                {update.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="notice-body">{post.body}</p>
      )}

      {!editing && (post.can_edit || post.can_delete) ? (
        <div className="notice-actions">
          {post.can_edit ? (
            <button type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
          ) : null}
          {post.can_delete && !confirmingDelete ? (
            <button type="button" onClick={() => setConfirmingDelete(true)}>
              Remove
            </button>
          ) : null}
          {confirmingDelete ? (
            <div className="delete-confirm" role="group" aria-label="Confirm removal">
              <span>Remove this notice?</span>
              <button type="button" onClick={() => setConfirmingDelete(false)}>
                Keep
              </button>
              <button
                className="danger"
                type="button"
                disabled={remove.isPending}
                onClick={() => remove.mutate()}
              >
                {remove.isPending ? "Removing…" : "Yes, remove"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function App() {
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<Scope>("all");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  const posts = useQuery({
    queryKey: ["posts", scope],
    queryFn: () => api.listPosts({ scope, limit: 50 }),
  });

  const create = useMutation({
    mutationFn: () => api.createPost({ body, visibility }),
    onSuccess: async (result) => {
      if (!result.ok) {
        setStatus(result.error);
        return;
      }
      setBody("");
      setScope(visibility === "public" ? "public" : "private");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      setStatus(visibility === "public" ? "Posted to the public wall." : "Saved for only you.");
    },
    onError: () => setStatus("The notice could not be posted. Please try again."),
  });

  const activeCount = useMemo(() => {
    if (!posts.data) return 0;
    if (scope === "public") return posts.data.counts.public;
    if (scope === "private") return posts.data.counts.private;
    return posts.data.counts.public + posts.data.counts.private;
  }, [posts.data, scope]);

  function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    create.mutate();
  }

  const emptyCopy =
    scope === "public"
      ? "No public notices yet. Pin the first one above."
      : scope === "private"
        ? "Your private corner is empty. Save a note that only you can see."
        : "The wall is clear. Pin a notice to get it started.";

  return (
    <div className="app-shell">
      <SafeAreaTopScrim backgroundColor="var(--bg)" />
      <main className="layout">
        <section className="composer-column" aria-labelledby="composer-title">
          <div className="intro">
            <p className="date-line">
              {new Intl.DateTimeFormat(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              }).format(new Date())}
            </p>
            <h1 id="composer-title">Pin a notice</h1>
            <p>Share it with the wall or keep it in your private corner.</p>
          </div>

          <form className="composer" onSubmit={submit}>
            <span className="tape" aria-hidden="true" />
            <fieldset>
              <legend>Who can see this?</legend>
              <div className="visibility-switch">
                <button
                  type="button"
                  className={visibility === "public" ? "selected" : ""}
                  aria-pressed={visibility === "public"}
                  onClick={() => setVisibility("public")}
                >
                  <strong>Public wall</strong>
                  <span>Anyone with access</span>
                </button>
                <button
                  type="button"
                  className={visibility === "private" ? "selected" : ""}
                  aria-pressed={visibility === "private"}
                  onClick={() => setVisibility("private")}
                >
                  <strong>Just me</strong>
                  <span>Private to your account</span>
                </button>
              </div>
            </fieldset>

            <label htmlFor="new-notice">Your message</label>
            <textarea
              id="new-notice"
              value={body}
              maxLength={500}
              rows={6}
              placeholder="What would you like to put on the wall?"
              onChange={(event) => {
                setBody(event.target.value);
                if (status) setStatus("");
              }}
            />
            <div className="composer-footer">
              <span className="character-count">{body.length}/500</span>
              <button className="button-primary" type="submit" disabled={!body.trim() || create.isPending}>
                {create.isPending ? "Pinning…" : visibility === "public" ? "Post publicly" : "Save privately"}
              </button>
            </div>
            <p className="status-line" aria-live="polite">
              {status}
            </p>
          </form>
        </section>

        <section className="board-column" aria-labelledby="wall-title">
          <div className="board-heading">
            <div>
              <h2 id="wall-title">The wall</h2>
              <p>{activeCount === 1 ? "1 notice" : `${activeCount} notices`}</p>
            </div>
            {posts.data?.viewer.is_owner ? <span className="owner-stamp">Board keeper</span> : null}
          </div>

          <nav className="tabs" aria-label="Notice visibility">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={scope === tab.value ? "active" : ""}
                aria-current={scope === tab.value ? "page" : undefined}
                onClick={() => setScope(tab.value)}
              >
                {tab.label}
                {posts.data && tab.value !== "all" ? (
                  <span>{posts.data.counts[tab.value]}</span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="notice-stack" aria-live="polite">
            {posts.isPending ? (
              <div className="loading-state">
                <span className="loading-line" />
                <span className="loading-line short" />
                <p>Checking the wall…</p>
              </div>
            ) : posts.isError ? (
              <div className="empty-state error-state">
                <h3>The wall didn’t load</h3>
                <p>Try checking it again.</p>
                <button type="button" className="button-primary compact" onClick={() => posts.refetch()}>
                  Try again
                </button>
              </div>
            ) : posts.data.posts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-pin" aria-hidden="true" />
                <h3>Nothing pinned here</h3>
                <p>{emptyCopy}</p>
              </div>
            ) : (
              posts.data.posts.map((post) => (
                <Notice key={post.id} post={post} onChanged={setStatus} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
