/**
 * dsh-favorites — client entry.
 *
 * A "收藏夹" (favorites) feature living in the conversation header action bar
 * (the official, stable DSH slot `conversation.session.header.actions`): a
 * starred button opens an anchored panel listing every favorited session, and
 * a star toggle marks/unmarks the current session. Persisted via the
 * `favorites` settings namespace. Because it rides a first-class DSH slot,
 * the layout never relies on fixed pixel coords / CSS-hash / third-party
 * plugin internals, so it keeps working across DSH updates.
 */
window.__ModuleLoader__.load({
	id: "dsh-favorites",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		var React = require("react");
		var ReactDOM = require("react-dom");

		// ---- module-level favorites store (observable) ----------------------
		var favoritesStore = {
			ids: Object.freeze([]),
			listeners: new Set()
		};
		function subscribeFavorites(onChange) {
			favoritesStore.listeners.add(onChange);
			return function () { favoritesStore.listeners.delete(onChange); };
		}
		function getFavoritesSnapshot() {
			return favoritesStore.ids;
		}
		function setFavorites(ids) {
			favoritesStore.ids = Object.freeze(Array.isArray(ids) ? ids.slice() : []);
			for (var fn of Array.from(favoritesStore.listeners)) {
				try { fn(); } catch (_e) { /* ignore */ }
			}
		}
		function useFavorites() {
			return React.useSyncExternalStore(subscribeFavorites, getFavoritesSnapshot);
		}
		function isFavorited(sessionId) {
			return sessionId != null && getFavoritesSnapshot().indexOf(sessionId) >= 0;
		}
		function toast(message) {
			var doc = typeof document !== "undefined" ? document : null;
			if (!doc || !doc.body) return;
			var el = doc.createElement("div");
			el.className = "dsh-fav-toast";
			el.textContent = message;
			doc.body.appendChild(el);
			setTimeout(function () { el.remove(); }, 2600);
		}

		var CSS = [
			// header star toggle
			".dsh-fav-header-star{border:none;background:transparent;cursor:pointer;color:var(--dsw-alias-label-tertiary,#8a94aa);font-size:15px;line-height:1;padding:2px 4px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;}",
			".dsh-fav-header-star:hover{color:var(--dsw-alias-label-primary,#172347);}",
			".dsh-fav-header-star.is-fav{color:#f5b301;}",
			// conversation-header favorites button — a stable official DSH slot:
			// DSH lays out the header actions itself, so no fixed coords / CSS-hash
			// / better-sidebar dependencies (safe across DSH updates).
			".dsh-fav-action{display:inline-flex;align-items:center;}",
			".dsh-fav-badge{border:1px solid transparent;background:transparent;cursor:pointer;color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-family);font-size:13px;line-height:20px;padding:3px 4px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;position:relative;}",
			".dsh-fav-badge:hover,.dsh-fav-badge[aria-expanded='true']{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);}",
			".dsh-fav-label{color:inherit;font-size:13px;line-height:20px;white-space:nowrap;}",
			".dsh-fav-count{position:absolute;top:-6px;right:-6px;height:15px;min-width:15px;padding:0 4px;box-sizing:border-box;color:#0b1220;background:#f5b301;font-size:10px;font-weight:700;line-height:15px;text-align:center;border-radius:8px;}",
			// anchored panel
			".dsh-fav-panel{z-index:2147483647;isolation:isolate;border:1px solid var(--dsw-alias-border-inverted);background:var(--dsw-specific-menu);width:320px;max-width:calc(100vw - 24px);max-height:60vh;box-shadow:var(--dsw-shadow-lv3);border-radius:12px;flex-direction:column;display:flex;position:fixed;overflow:hidden;}",
			".dsh-fav-panel-header{box-sizing:border-box;flex:none;justify-content:space-between;align-items:center;min-height:44px;padding:10px 12px;display:flex;}",
			".dsh-fav-panel-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:20px;}",
			".dsh-fav-panel-list{flex:1;min-height:0;padding:0 12px 12px;overflow-y:auto;}",
			".dsh-fav-row{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:8px;}",
			".dsh-fav-row:hover{background:var(--dsw-alias-interactive-bg-hover);}",
			".dsh-fav-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;color:var(--dsw-alias-label-primary);}",
			".dsh-fav-remove{border:none;background:transparent;cursor:pointer;color:var(--dsw-alias-label-tertiary);font-size:16px;line-height:1;padding:0 2px;border-radius:4px;}",
			".dsh-fav-remove:hover{color:var(--dsw-alias-state-error-primary);}",
			".dsh-fav-empty{padding:6px 8px;color:var(--dsw-alias-label-tertiary);font-size:12px;}",
			".dsh-fav-toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483000;padding:8px 14px;border-radius:8px;background:rgba(15,20,35,0.96);color:#ffd98a;font-size:13px;line-height:1.4;box-shadow:0 6px 22px rgba(0,0,0,0.45);max-width:80vw;user-select:none;}",
		].join("\n");

		// ---- header star toggle ---------------------------------------------
		function FavoriteToggle(props) {
			var sessionId = props.sessionId;
			var toggle = props.toggle;
			var favorites = useFavorites();
			var isFav = favorites.indexOf(sessionId) >= 0;
			return React.createElement("button", {
				type: "button",
				className: "dsh-fav-header-star" + (isFav ? " is-fav" : ""),
				"aria-label": isFav ? "\u53d6\u6d88\u6536\u85cf" : "\u6536\u85cf", // 取消收藏 / 收藏
				title: isFav ? "\u53d6\u6d88\u6536\u85cf" : "\u6536\u85cf",
				onClick: function (event) {
					event.stopPropagation();
					toggle(sessionId);
				}
			}, isFav ? "\u2605" : "\u2606"); // ★ / ☆
		}

		// ---- conversation-header favorites entry + anchored panel ----------
		function FavoritesAction(props) {
			var openSession = props.open;
			var removeFavorite = props.remove;
			var useSessions = props.useSessions;
			var favorites = useFavorites();
			var byId = useSessions(function (state) { return state.byId; });

			var rootRef = React.useRef(null);
			var panelRef = React.useRef(null);
			var openState = React.useState(false);
			var open = openState[0];
			var setOpen = openState[1];
			var anchorState = React.useState(void 0);
			var anchor = anchorState[0];
			var setAnchor = anchorState[1];

			React.useLayoutEffect(function () {
				if (!open) return;
				function place() {
					var rect = rootRef.current && rootRef.current.getBoundingClientRect();
					if (rect !== void 0) setAnchor({
						top: rect.bottom + 6,
						right: window.innerWidth - rect.right
					});
				}
				place();
				window.addEventListener("resize", place);
				return function () { window.removeEventListener("resize", place); };
			}, [open]);

			React.useEffect(function () {
				if (!open) return;
				function onDocClick(event) {
					if (rootRef.current && rootRef.current.contains(event.target)) return;
					if (panelRef.current && panelRef.current.contains(event.target)) return;
					setOpen(false);
				}
				document.addEventListener("pointerdown", onDocClick, true);
				return function () { document.removeEventListener("pointerdown", onDocClick, true); };
			}, [open]);

			function sessionTitle(id) {
				var session = byId && byId[id];
				if (!session) return id;
				return session.blank ? "\u65b0\u4f1a\u8bdd" : (session.displayTitle || id); // 新会话
			}

			var badgeChildren = [
				React.createElement("span", { key: "label", className: "dsh-fav-label" }, "\u6536\u85cf\u5939"), // 收藏夹
				favorites.length > 0 ? React.createElement("span", { key: "count", className: "dsh-fav-count" }, String(favorites.length)) : null
			];

			return React.createElement("div", {
				ref: rootRef,
				className: "dsh-fav-action"
			},
				open && anchor !== void 0 ? ReactDOM.createPortal(React.createElement("section", {
					ref: panelRef,
					className: "dsh-fav-panel",
					style: anchor,
					"aria-label": "\u6536\u85cf\u5939" // 收藏夹
				},
					React.createElement("header", { className: "dsh-fav-panel-header" },
						React.createElement("span", { className: "dsh-fav-panel-title" }, "\u6536\u85cf\u5939") // 收藏夹
					),
					React.createElement("div", { className: "dsh-fav-panel-list" },
						favorites.length === 0 ? React.createElement("div", { className: "dsh-fav-empty" }, "\u6682\u65e0\u6536\u85cf") : // 暂无收藏
						favorites.map(function (id) {
							return React.createElement("div", { key: id, className: "dsh-fav-row" },
								React.createElement("span", {
									className: "dsh-fav-title",
									title: id,
									onClick: function () { setOpen(false); openSession(id); }
								}, sessionTitle(id)),
								React.createElement("button", {
									type: "button",
									className: "dsh-fav-remove",
									"aria-label": "\u53d6\u6d88\u6536\u85cf", // 取消收藏
									onClick: function () { removeFavorite(id); }
								}, "\u00d7") // ×
							);
						})
					)
				), document.body) : null,
				React.createElement("button", {
					type: "button",
					className: "dsh-fav-badge",
					"aria-expanded": open ? "true" : "false",
					"aria-label": "\u6536\u85cf\u5939", // 收藏夹
					onClick: function () { setOpen(!open); }
				}, badgeChildren)
			);
		}

		// ---- plugin body ----------------------------------------------------
		function apply(ctx) {
			var doc = typeof document !== "undefined" ? document : null;
			if (doc && doc.head) {
				var style = doc.createElement("style");
				style.id = "dsh-favorites-style";
				style.dataset.plugin = "dsh-favorites";
				style.dataset.pluginCss = "favorites";
				style.textContent = CSS;
				if (!doc.getElementById(style.id)) {
					doc.head.appendChild(style);
					ctx.effect(function () { return function () { style.remove(); }; }, "dsh-favorites: style");
				}
			}

			var api = ctx.get("connection").api;
			var sessions = ctx.get("sessions");

			function loadFavorites() {
				api.settings.describe({}).then(function (response) {
					if (!response.result || !response.result.ok) return;
					var namespaces = response.result.value && response.result.value.namespaces;
					if (!Array.isArray(namespaces)) return;
					var found = namespaces.find(function (n) { return n.ns === "favorites"; });
					var value = found && found.value;
					setFavorites(Array.isArray(value && value.sessionIds) ? value.sessionIds : []);
				}).catch(function () { /* ignore */ });
			}

			function saveFavorites(ids) {
				setFavorites(ids);
				try {
					api.settings.mutate({
						ns: "favorites",
						ops: [{ op: "set", path: ["sessionIds"], value: ids }]
					});
				} catch (_e) { /* ignore */ }
			}

			function toggleFavorite(sessionId) {
				var ids = getFavoritesSnapshot();
				var next = ids.indexOf(sessionId) >= 0
					? ids.filter(function (id) { return id !== sessionId; })
					: ids.concat([sessionId]);
				saveFavorites(next);
			}

			function openSession(sessionId) {
				try { sessions.open(sessionId); } catch (_e) { /* ignore */ }
			}

			// Block archive for favorited sessions (rename + fork stay available).
			try {
				var workspaces = ctx.get("workspaces");
				if (workspaces && typeof workspaces.archiveSession === "function") {
					var originalArchive = workspaces.archiveSession.bind(workspaces);
					workspaces.archiveSession = function (sessionId) {
						if (isFavorited(sessionId)) {
							toast("\u5df2\u6536\u85cf\u7684\u4f1a\u8bdd\u4e0d\u80fd\u5f52\u6863\uff0c\u8bf7\u5148\u53d6\u6d88\u6536\u85cf"); // 已收藏的会话不能归档，请先取消收藏
							return Promise.reject(new Error("favorited session"));
						}
						return originalArchive(sessionId);
					};
				}
			} catch (_e) { /* ignore */ }

			loadFavorites();

			ctx.slots.inject("conversation.session.header.actions", function* () {
				yield ctx.slots.register({
					name: "conversation.session.header.actions",
					id: "favorite",
					order: 15,
					inject: function () { return { toggle: toggleFavorite }; }
				}, FavoriteToggle);
				yield ctx.slots.register({
					name: "conversation.session.header.actions",
					id: "favorites",
					order: 16,
					inject: function () { return { open: openSession, remove: toggleFavorite }; }
				}, FavoritesAction);
			});
		}

		exports.apply = apply;
		exports.inject = ["sessions", "slots", "connection", "workspaces"];
		return module.exports;
	}
});
