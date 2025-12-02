// LayerSelectControl.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

export interface LayerItem {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    thumbnailHd?: string;
}

interface Props {
    defaultItem?: LayerItem;
    items: LayerItem[];
    x?: number;
    y?: number;
    xRel?: "left" | "right";
    yRel?: "top" | "bottom";
    onDefault: (item?: LayerItem) => void;
    onSelect: (item: LayerItem) => void;
    onMore?: () => void;
    maxVisible?: number;
    hoverCloseDelayMs?: number;
    theme?: "dark" | "light";
    defaultThumb?: string;
    noImageThumb?: string;
    moreThumb?: string;
    size?: "small" | "medium" | "large";
    panelGap?: number;
    parentGap?: number;
}

const DEFAULT_RESET_IMAGE_URL = "./firstplace.svg";
const DEFAULT_NO_IMAGE_URL = "./noimage.png";
const DEFAULT_IMAGE_MORE = "./more-images.png";
const DEFAULT_MAX_VISIBLE = 4;

const SIZE_CONFIG = {
    small: { collapsed: 64, thumb: 56, tileWidth: 84, tileThumb: 72 },
    medium: { collapsed: 88, thumb: 76, tileWidth: 108, tileThumb: 96 },
    large: { collapsed: 112, thumb: 96, tileWidth: 140, tileThumb: 120 },
};

// ------------------------------------------------------
// ManagedImage (NO FLICKER)
// ------------------------------------------------------
function ManagedImage({
                          candidates,
                          initial,
                          alt,
                          className,
                          expanded,
                          noImageThumb,
                      }: {
    candidates: string[];
    expanded: boolean;
    initial?: string;
    alt?: string;
    className?: string;
    noImageThumb: string;
}) {
    const [finalSrc, setFinalSrc] = useState<string | null>(null);

    useEffect(() => {
        setFinalSrc(null);
        const urls = expanded ? candidates : [initial ?? candidates[0] ?? noImageThumb];

        let cancelled = false;

        const loadNext = (idx: number) => {
            if (idx >= urls.length) {
                if (!cancelled) setFinalSrc(noImageThumb);
                return;
            }
            const url = urls[idx];
            const img = new Image();
            img.onload = () => !cancelled && setFinalSrc(url);
            img.onerror = () => !cancelled && loadNext(idx + 1);
            img.src = url;
        };

        loadNext(0);
        return () => {
            cancelled = true;
        };
    }, [expanded, initial, candidates, noImageThumb]);

    if (!finalSrc) {
        return <div className={className} style={{ background: "#444", borderRadius: "8px" }} />;
    }

    return <img src={finalSrc} alt={alt} className={className} draggable={false} />;
}

// ------------------------------------------------------
// Main Component
// ------------------------------------------------------
export const LayersSelectControl: React.FC<Props> = ({
                                                         items,
                                                         x = 8,
                                                         y = 32,
                                                         xRel = "left",
                                                         yRel = "bottom",
                                                         defaultItem,
                                                         onSelect,
                                                         onMore,
                                                         onDefault,
                                                         maxVisible = DEFAULT_MAX_VISIBLE,
                                                         hoverCloseDelayMs = 160,
                                                         theme = "dark",
                                                         defaultThumb = DEFAULT_RESET_IMAGE_URL,
                                                         noImageThumb = DEFAULT_NO_IMAGE_URL,
                                                         moreThumb = DEFAULT_IMAGE_MORE,
                                                         size = "small",
                                                         panelGap = 8,
                                                         parentGap = 8,
                                                     }) => {
    const [expanded, setExpanded] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const [selectedId, setSelectedId] = useState<string | undefined>(items[0]?.id);
    const [parentWidth, setParentWidth] = useState<number | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const hoverTimer = useRef<number | null>(null);

    // unique id for scoping styles to this instance
    const uidRef = useRef<string | null>(null);
    if (uidRef.current === null) {
        uidRef.current = "lsc-" + Math.random().toString(36).slice(2, 9);
    }
    const uid = uidRef.current;

    const cfg = SIZE_CONFIG[size];

    // Detect touch devices
    useEffect(() => {
        setIsTouch(typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0));
    }, []);

    // Close panel if click outside
    useEffect(() => {
        if (!expanded) return;
        const onPointer = (ev: PointerEvent) => {
            if (!rootRef.current) return;
            if (ev.target instanceof Node && !rootRef.current.contains(ev.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener("pointerdown", onPointer, { capture: true });
        return () => document.removeEventListener("pointerdown", onPointer, { capture: true });
    }, [expanded]);

    // Parent width measurement
    useEffect(() => {
        if (!rootRef.current) return;
        const parent = rootRef.current.parentElement;
        if (!parent) return;

        const updateWidth = () => setParentWidth(parent.clientWidth);
        updateWidth();
        const ro = new ResizeObserver(updateWidth);
        ro.observe(parent);
        return () => ro.disconnect();
    }, []);

    const expandToRight = xRel === "left";

    const collapsedThumb = useCallback((it?: LayerItem) => it?.thumbnail ?? noImageThumb, [noImageThumb]);

    const expandedCandidates = useCallback(
        (it?: LayerItem) => [...(it?.thumbnailHd ? [it.thumbnailHd] : []), ...(it?.thumbnail ? [it.thumbnail] : []), noImageThumb],
        [noImageThumb]
    );

    const selectedItem = useMemo(() => items.find((x) => x.id === selectedId), [items, selectedId]);

    const handleMouseEnter = () => {
        if (isTouch) return;
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setExpanded(true);
    };

    const handleMouseLeave = () => {
        if (isTouch) return;
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => setExpanded(false), hoverCloseDelayMs);
    };

    // ----------------------------
    // IMPORTANT: rootStyle uses exactly x/y (no parentGap added here).
    // parentGap is applied to the far-side by the maxWidth calculation below.
    // ----------------------------
    const rootStyle: React.CSSProperties = {
        position: "absolute",
        [xRel]: `${x}px`,
        [yRel]: `${y}px`,
        zIndex: 99999,
        touchAction: "manipulation",
    };

    const themeVars =
        theme === "dark"
            ? {
                bg: "linear-gradient(180deg,#1b1f23,#111418)",
                panelBg: "linear-gradient(180deg,#1e242a,#161b20)",
                text: "#9ca3af",
                subtext: "#9ca3af",
                border: "rgba(255,255,255,0.08)",
                hover: "rgba(255,255,255,0.08)",
            }
            : {
                bg: "linear-gradient(180deg,#ffffff,#f7f9fb)",
                panelBg: "linear-gradient(180deg,#ffffff,#fbfdff)",
                text: "#0f1720",
                subtext: "#556070",
                border: "rgba(9,30,66,0.06)",
                hover: "rgba(9,30,66,0.06)",
            };

    const updateArrows = useCallback(() => {
        if (!scrollRef.current) return;
        const scroll = scrollRef.current;
        setCanScrollLeft(scroll.scrollLeft > 0);
        setCanScrollRight(scroll.scrollLeft + scroll.clientWidth < scroll.scrollWidth - 1);
    }, []);

    const scrollBy = (dir: number) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir * 120, behavior: "smooth" });
    };

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        updateArrows();

        scrollEl.addEventListener("scroll", updateArrows);
        const ro = new ResizeObserver(updateArrows);
        ro.observe(scrollEl);
        window.addEventListener("resize", updateArrows);

        return () => {
            scrollEl.removeEventListener("scroll", updateArrows);
            ro.disconnect();
            window.removeEventListener("resize", updateArrows);
        };
    }, [scrollRef.current, expanded, updateArrows]);

    // --------------------------
    // APPLY maxVisible FIX
    // - visibleItems: items to render inside the tiles area
    // - showMore: whether to render the "More…" tile
    // --------------------------
    const visibleItems = useMemo(() => {
        if (!maxVisible || items.length <= maxVisible) return items;
        return items.slice(0, maxVisible);
    }, [items, maxVisible]);

    const showMore = Boolean(onMore && items.length > (maxVisible || 0));

    return (
        <div ref={rootRef} id={uid} style={rootStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <style>{`
/* Scoped to instance #${uid} */
#${uid} .lsc-root { font-family: Inter, system-ui; color: ${themeVars.text}; font-size: 13px; }
#${uid} .lsc-collapsed {
    width:${cfg.collapsed}px; height:${cfg.collapsed}px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    background:${themeVars.bg}; box-shadow:0 8px 22px rgba(0,0,0,0.4);
    border:1px solid ${themeVars.border};
    cursor:pointer; overflow:hidden;
}
#${uid} .lsc-thumb { width:${cfg.thumb}px; height:${cfg.thumb*0.714}px; object-fit:cover; background:#0005; border-radius:8px; }
#${uid} .lsc-panel-wrap { position:absolute; top:50%; transform:translateY(-50%); display:flex; align-items:center; max-width:100%; }
#${uid} .lsc-panel {
    display:flex; align-items:center; padding:8px; border-radius:12px;
    background:${themeVars.panelBg}; box-shadow:0 12px 34px rgba(0,0,0,0.4);
    border:1px solid ${themeVars.border};
    transition:transform 200ms ease, opacity 150ms ease;
    overflow:hidden;
    gap:8px;
}
#${uid} .lsc-scroll-wrap { position:relative; display:flex; align-items:center; gap:4px; overflow:hidden; flex:1; }
#${uid} .lsc-tiles-wrap { overflow-x:auto; overflow-y:hidden; scrollbar-width:none; -ms-overflow-style:none; flex:1; }
#${uid} .lsc-tiles-wrap::-webkit-scrollbar { display:none; }
#${uid} .lsc-tiles { display:flex; gap:8px; flex-wrap:nowrap; }
#${uid} .lsc-tile { display:flex; flex-direction:column; gap:6px; cursor:pointer; width:${cfg.tileWidth}px; padding:4px; border-radius:8px; flex-shrink:0; }
#${uid} .lsc-tile:hover { background:${themeVars.hover}; }
#${uid} .lsc-t-thumb { width:${cfg.tileThumb}px; height:${cfg.tileThumb*0.667}px; object-fit:cover; background:#0005; border-radius:8px; }
#${uid} .lsc-title { color:${themeVars.text}; font-weight:600; max-width:${cfg.tileThumb}px; white-space:nowrap; overflow:hidden; }
#${uid} .lsc-desc { color:${themeVars.subtext}; font-size:11px; max-width:${cfg.tileThumb}px; white-space:nowrap; overflow:hidden; }

/* ---------------- Arrow Button Styling ---------------- */
#${uid} .lsc-arrow {
    position:absolute;
    top:0;
    bottom:0;
    display:flex;
    align-items:center;
    justify-content:center;
    width:36px;
    font-weight:bold;
    font-size:20px;
    user-select:none;
    border-radius:8px;
    cursor:pointer;
    z-index:10;

    background: rgba(0,0,0,0.12);
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
}
#${uid} .lsc-arrow-left { left:0; }
#${uid} .lsc-arrow-right { right:0; }
#${uid} .lsc-arrow:hover {
    background: rgba(0,0,0,0.25);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    transform: scale(1.05);
}
#${uid} .lsc-arrow:active {
    background: rgba(0,0,0,0.35);
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transform: translateY(2px) scale(0.98);
}
`}</style>

            {/* NOTE: gap set to 0 so absolute panel positioning + panelGap control spacing */}
            <div className="lsc-root" style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div
                    className="lsc-collapsed"
                    onClick={() => setExpanded((s) => !s)}
                    title={`${selectedItem?.title}\n${selectedItem?.description}`}
                    role="button"
                    aria-expanded={expanded}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setExpanded((s) => !s);
                        }
                    }}
                >
                    <ManagedImage
                        candidates={[collapsedThumb(selectedItem)]}
                        initial={collapsedThumb(selectedItem)}
                        expanded={false}
                        alt="Selected thumbnail"
                        className="lsc-thumb"
                        noImageThumb={noImageThumb}
                    />
                </div>

                <div
                    className="lsc-panel-wrap"
                    style={{
                        left: expandToRight ? `${cfg.collapsed + panelGap}px` : undefined,
                        right: expandToRight ? undefined : `${cfg.collapsed + panelGap}px`,
                        /* FIXED: available width = parentWidth - (x + collapsed) - panelGap - parentGap
                           This keeps parentGap as the distance from the expanded panel's far edge to the parent border,
                           regardless of where the collapsed control is positioned (x). */
                        maxWidth: parentWidth ? `${parentWidth - (x + cfg.collapsed) - panelGap - parentGap}px` : undefined,
                    }}
                >
                    <div
                        className="lsc-panel"
                        style={{
                            opacity: expanded ? 1 : 0,
                            transform: expanded ? "scale(1)" : "scale(0.97)",
                            pointerEvents: expanded ? "auto" : "none",
                        }}
                    >
                        {/* Default at edge */}
                        {typeof onDefault === "function" && (
                            <div
                                className="lsc-tile"
                                onClick={() => {
                                    onDefault(defaultItem);
                                    setExpanded(false);
                                }}
                            >
                                <ManagedImage
                                    candidates={[defaultThumb]}
                                    initial={defaultThumb}
                                    expanded={expanded}
                                    alt="Default"
                                    className="lsc-t-thumb"
                                    noImageThumb={noImageThumb}
                                />
                                <div className="lsc-title">Default</div>
                                <div className="lsc-desc">Initial Content</div>
                            </div>
                        )}

                        {/* Scrollable area */}
                        <div className="lsc-scroll-wrap">
                            {canScrollLeft && (
                                <div className="lsc-arrow lsc-arrow-left" onClick={() => scrollBy(-1)}>
                                    ❮
                                </div>
                            )}
                            <div className="lsc-tiles-wrap" ref={scrollRef}>
                                <div className="lsc-tiles">
                                    {visibleItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="lsc-tile"
                                            onClick={() => {
                                                setSelectedId(item.id);
                                                onSelect(item);
                                                setTimeout(() => setExpanded(false), 10);
                                            }}
                                        >
                                            <ManagedImage
                                                candidates={expandedCandidates(item)}
                                                initial={collapsedThumb(item)}
                                                expanded={expanded}
                                                alt={item.title}
                                                className="lsc-t-thumb"
                                                noImageThumb={noImageThumb}
                                            />
                                            <div className="lsc-title">{item.title}</div>
                                            <div className="lsc-desc">{item.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {canScrollRight && (
                                <div className="lsc-arrow lsc-arrow-right" onClick={() => scrollBy(1)}>
                                    ❯
                                </div>
                            )}
                        </div>

                        {/* More at edge */}
                        {showMore && (
                            <div
                                className="lsc-tile"
                                onClick={() => {
                                    onMore?.();
                                    setExpanded(false);
                                }}
                            >
                                <ManagedImage
                                    candidates={[moreThumb]}
                                    initial={moreThumb}
                                    expanded={expanded}
                                    alt="More"
                                    className="lsc-t-thumb"
                                    noImageThumb={noImageThumb}
                                />
                                <div className="lsc-title">More…</div>
                                <div className="lsc-desc">Show all</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
