import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { api, type ApiResponse } from "./api";

type Item = ApiResponse<typeof api, "listItems">["items"][number];

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

function GroceryItem({
  item,
  onToggle,
  onDelete,
  busy,
}: {
  item: Item;
  onToggle: (item: Item) => void;
  onDelete: (id: number) => void;
  busy: boolean;
}) {
  return (
    <li className={`grocery-row ${item.completed ? "is-complete" : ""}`}>
      <button
        type="button"
        className="check-wrap"
        aria-label={`${item.completed ? "Mark as needed" : "Mark as picked up"}: ${item.text}`}
        aria-pressed={item.completed}
        onClick={() => onToggle(item)}
        disabled={busy}
      >
        <span className="custom-check" aria-hidden="true">
          <svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" /></svg>
        </span>
      </button>
      <span className="item-name">{item.text}</span>
      <button
        type="button"
        className="delete-button"
        aria-label={`Delete ${item.text}`}
        onClick={() => onDelete(item.id)}
        disabled={busy}
      >
        <TrashIcon />
      </button>
    </li>
  );
}

export function App() {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [localError, setLocalError] = useState("");

  const itemsQuery = useQuery({
    queryKey: ["shopping-items"],
    queryFn: () => api.listItems({}),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["shopping-items"] });

  const addItem = useMutation({
    mutationFn: (itemText: string) => api.addItem({ text: itemText }),
    onSuccess: () => {
      setText("");
      setLocalError("");
      refresh();
    },
    onError: () => setLocalError("Couldn’t add that item. Try again."),
  });

  const toggleItem = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      api.setItemCompleted({ id, completed }),
    onSuccess: refresh,
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => api.deleteItem({ id }),
    onSuccess: refresh,
  });

  const clearCompleted = useMutation({
    mutationFn: () => api.clearCompleted({}),
    onSuccess: refresh,
  });

  const items = itemsQuery.data?.items ?? [];
  const active = useMemo(() => items.filter((item) => !item.completed), [items]);
  const completed = useMemo(() => items.filter((item) => item.completed), [items]);
  const busy = toggleItem.isPending || deleteItem.isPending || clearCompleted.isPending;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setLocalError("Type an item first.");
      return;
    }
    addItem.mutate(trimmed);
  }

  return (
    <div className="app-shell">
      <SafeAreaTopScrim backgroundColor="var(--bg)" />
      <main className="list-page">
        <section className="intro" aria-labelledby="list-heading">
          <div>
            <p className="count-line">
              <strong>{active.length}</strong>
              <span>{active.length === 1 ? "item left" : "items left"}</span>
            </p>
            <h1 id="list-heading">What do you need?</h1>
          </div>
          {completed.length > 0 && (
            <span className="picked-count">{completed.length} picked up</span>
          )}
        </section>

        <form className="composer" onSubmit={handleSubmit}>
          <input
            id="new-item"
            aria-label="Item name"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (localError) setLocalError("");
            }}
            maxLength={120}
            placeholder="Add milk, apples, bread…"
            autoComplete="off"
          />
          <button type="submit" className="add-button" aria-label="Add item" disabled={addItem.isPending}>
            <PlusIcon />
          </button>
        </form>

        {localError && <p className="form-error" role="alert">{localError}</p>}

        <section className="paper-list" aria-label="Shopping items">
          {itemsQuery.isPending ? (
            <div className="state-message" role="status">
              <span className="loading-dot" />
              <p>Opening your list…</p>
            </div>
          ) : itemsQuery.isError ? (
            <div className="state-message error-state">
              <p>We couldn’t open your list.</p>
              <button type="button" onClick={() => itemsQuery.refetch()}>Try again</button>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-mark" aria-hidden="true">
                <span /> <span /> <span />
              </div>
              <h2>Your list is ready</h2>
              <p>Add the first thing you don’t want to forget.</p>
            </div>
          ) : (
            <>
              {active.length > 0 && (
                <ul className="grocery-list" aria-label="Items still needed">
                  {active.map((item) => (
                    <GroceryItem
                      key={item.id}
                      item={item}
                      busy={busy}
                      onToggle={(current) => toggleItem.mutate({ id: current.id, completed: true })}
                      onDelete={(id) => deleteItem.mutate(id)}
                    />
                  ))}
                </ul>
              )}

              {completed.length > 0 && (
                <div className="completed-block">
                  <div className="completed-heading">
                    <h2>Picked up</h2>
                    <button
                      type="button"
                      onClick={() => clearCompleted.mutate()}
                      disabled={clearCompleted.isPending}
                    >
                      Clear checked
                    </button>
                  </div>
                  <ul className="grocery-list" aria-label="Picked up items">
                    {completed.map((item) => (
                      <GroceryItem
                        key={item.id}
                        item={item}
                        busy={busy}
                        onToggle={(current) => toggleItem.mutate({ id: current.id, completed: false })}
                        onDelete={(id) => deleteItem.mutate(id)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
