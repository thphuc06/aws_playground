# Focused canvas and unified resource palette

2026-11-02

- The diagram precedes the collapsed AI assistant. Both original and AI proposal canvases come before their supporting controls/explanations.
- A unified Resources palette occupies the left, with Services and Network & resources tabs. Configuration occupies the right. Both panels toggle independently. Frames are compact draggable tiles; shared network resources and IAM open their editors on the right. The old full-width Add frame form is removed from the Builder flow.
- Service and network editors occupy the right configuration panel. Configuration and Resources have independent visibility controls. On narrower screens, panels become opposite-side drawers.
- Full screen uses the application viewport, keeps canvas controls available and makes surrounding page UI inert. Escape or Exit full screen restores the prior focus and scroll behavior. This is a focused application workspace, not an OS/browser full-screen permission request.
- Supporting instructions use keyboard-accessible ? disclosures. Home exam/scope guidance, theory metadata, coverage explanations and configuration field help are compact. Examples and simulation details are disclosed on demand. Lesson bodies and explicit AI consent remain available.
- Network resource selection checks unsaved configuration before switching. Existing graph schema, stored workspace data, IAM library, endpoints and environment variables are unchanged.

Validation:563 tests pass across39 files, including focus isolation/restore, collapsed AI placement after the canvas and resource-editor-only behavior. Frontend/backend typechecks and frontend production build pass; indexed secret scan is run before commit. Real-browser layout/drag/fullscreen E2E has not been verified because browser preview access was unavailable. Existing Vite chunk-size advisory remains.

Publication: GitHub main and existing owner-private Site. This is a frontend update; no new environment variables or manual backend deployment is required.

The Render origin is preconfigured; the UI checks status automatically and offers Reconnect on failure. No backend URL or token input is shown. Auto-connect sends no graph; explicit consent is still required for a review request.
