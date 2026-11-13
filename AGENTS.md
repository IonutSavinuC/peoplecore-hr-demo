<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- All HR data and the login session live in browser localStorage via `HrProvider` (src/hooks/use-hr.tsx); there is no backend, because the app is a self-contained test target for Playwright.
- Domain logic (seed data, validation, search/sort, salary format) stays pure in src/lib/hr.ts with tests in src/lib/hr.test.ts, so rules can be unit tested without the UI.
- Every interactive element keeps the exact `data-testid` from the original brief; never rename or remove them, because the external E2E suite depends on them.
- Use native `<input>`/`<select>` elements for form controls so Playwright `fill`/`selectOption` work directly.
- Only one toast is shown at a time (newest replaces older) so `toast-notification` is always a single element.
