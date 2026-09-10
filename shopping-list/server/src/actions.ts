import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { asc, eq } from "drizzle-orm";
import * as schema from "./schema";

const itemShape = z.object({
  id: z.number(),
  text: z.string(),
  completed: z.boolean(),
  created_at: z.string(),
});

export const Actions = {
  listItems: defineAction({
    request: z.object({}),
    response: z.object({ items: z.array(itemShape) }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db
        .select()
        .from(schema.entries)
        .orderBy(asc(schema.entries.id));

      return {
        items: rows.map((row) => ({
          id: row.id,
          text: row.text,
          completed: row.completed,
          created_at: row.createdAt.toISOString(),
        })),
      };
    },
  }),

  addItem: defineAction({
    request: z.object({ text: z.string().trim().min(1).max(120) }),
    response: z.object({ item: itemShape }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db
        .insert(schema.entries)
        .values({ text: args.text.trim(), completed: false })
        .returning();
      const row = rows[0];
      if (!row) throw new Error("The item could not be added.");
      ctx.invalidateQueries();
      return {
        item: {
          id: row.id,
          text: row.text,
          completed: row.completed,
          created_at: row.createdAt.toISOString(),
        },
      };
    },
  }),

  setItemCompleted: defineAction({
    request: z.object({ id: z.number().int().positive(), completed: z.boolean() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db
        .update(schema.entries)
        .set({ completed: args.completed })
        .where(eq(schema.entries.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  deleteItem: defineAction({
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.entries).where(eq(schema.entries.id, args.id));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  clearCompleted: defineAction({
    request: z.object({}),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      await db.delete(schema.entries).where(eq(schema.entries.completed, true));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),
} satisfies ActionsModule;
