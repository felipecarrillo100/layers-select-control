import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

export interface LayerItem {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    thumbnailHd?: string;
}

interface Props {
    value?: string;
    defaultValue?: string;

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

    onExpand?: () => void;
    onCollapse?: () => void;
}

const DEFAULT_RESET_IMAGE_URL = "./firstplace.svg";
const DEFAULT_NO_IMAGE_URL = "./noimage.png";
const DEFAULT_IMAGE_MORE = "./more-images.png";
const DEFAULT_MAX_VISIBLE = 5;

const SIZE_CONFIG = {
    small: { collapsed: 64, thumb: 56, tileWidth: 84, tileThumb: 72 },
    medium: { collapsed: 88, thumb: 76, tileWidth: 108, tileThumb: 96 },
    large: { collapsed: 112, thumb: 96, tileWidth: 140, tileThumb: 120 },
};

// ------------------------------------------------------
// ManagedImage (FIXED – no flashing)
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
        const urls = expanded
            ? candidates
            : [initial ?? candidates[0] ?? noImageThumb];

        let cancelled = false;

        const loadNext = (idx: number) => {
            if (idx >= urls.length) return;
            const img = new Image();
            img.onload = () => {
                if (!cancelled) setFinalSrc(urls[idx]);
            };
            img.onerror = () => !cancelled && loadNext(idx + 1);
            img.src = urls[idx];
        };

        loadNext(0);
        return () => {
            cancelled = true;
        };
    }, [expanded, initial, candidates, noImageThumb]);

    if (!finalSrc) {
        return <div className={className} />;
    }

    return <img src={finalSrc} alt={alt} className={className} draggable={false} />;
}

// ------------------------------------------------------
// COMPONENT (LOGIC PRESERVED)
// ------------------------------------------------------
export const LayersSelectControl: React.FC<Props> = ({
                                                         items,
                                                         value,
                                                         defaultValue,
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
                                                         onCollapse,
                                                         onExpand
                                                     }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const selectedId = isControlled ? value : internalValue;

    const setSelectedId = (id: string) => {
        if (!isControlled) setInternalValue(id);
    };

    const [expanded, setExpanded] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const [parentWidth, setParentWidth] = useState<number | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const hoverTimer = useRef<number | null>(null);

    const cfg = SIZE_CONFIG[size];

    useEffect(() => {
        setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);

    useEffect(() => {
        if (expanded) {
            onExpand?.();
        } else {
            onCollapse?.();
        }
    }, [expanded, onExpand, onCollapse]);

    useEffect(() => {
        if (!expanded) return;
        const onPointer = (ev: PointerEvent) => {
            if (rootRef.current && ev.target instanceof Node && !rootRef.current.contains(ev.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener("pointerdown", onPointer, { capture: true });
        return () => document.removeEventListener("pointerdown", onPointer, { capture: true });
    }, [expanded]);

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

    const collapsedThumb = useCallback(
        (it?: LayerItem) => it?.thumbnail ?? noImageThumb,
        [noImageThumb]
    );

    const expandedCandidates = useCallback(
        (it?: LayerItem) => [
            ...(it?.thumbnailHd ? [it.thumbnailHd] : []),
            ...(it?.thumbnail ? [it.thumbnail] : []),
            noImageThumb,
        ],
        [noImageThumb]
    );

    const selectedItem = useMemo(() => {
        if (defaultItem && selectedId === defaultItem.id) return defaultItem;
        return items.find((x) => x.id === selectedId);
    }, [items, selectedId, defaultItem]);

    const collapsedCandidates = useMemo(
        () => [collapsedThumb(selectedItem)],
        [collapsedThumb, selectedItem]
    );

    const updateArrows = useCallback(() => {
        if (!scrollRef.current) return;
        const s = scrollRef.current;
        setCanScrollLeft(s.scrollLeft > 0);
        setCanScrollRight(s.scrollLeft + s.clientWidth < s.scrollWidth - 1);
    }, []);

    const scrollBy = (dir: number) => {
        scrollRef.current?.scrollBy({ left: dir * 120, behavior: "smooth" });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener("scroll", updateArrows);
        const ro = new ResizeObserver(updateArrows);
        ro.observe(el);
        window.addEventListener("resize", updateArrows);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            ro.disconnect();
            window.removeEventListener("resize", updateArrows);
        };
    }, [updateArrows]);

    const visibleItems = useMemo(() => {
        if (!maxVisible || items.length <= maxVisible) return items;
        return items.slice(0, maxVisible);
    }, [items, maxVisible]);

    const showMore = Boolean(onMore);
    const hasContent = () => showMore || items.length > 0 || defaultItem !== undefined;
    const toggleExpanded = () => {
        setExpanded((s) => (s ? false : hasContent()));
    };

    return (
        <div
            ref={rootRef}
            className={`lsc-root ${theme === "light" ? "lsc-light" : ""}`}
            style={{
                [xRel]: `${x}px`,
                [yRel]: `${y}px`,
                "--lsc-collapsed": `${cfg.collapsed}px`,
                "--lsc-thumb": `${cfg.thumb}px`,
                "--lsc-tile-width": `${cfg.tileWidth}px`,
                "--lsc-tile-thumb": `${cfg.tileThumb}px`,
                "--lsc-panel-gap": `${panelGap}px`,
                "--lsc-parent-gap": `${parentGap}px`,
            } as React.CSSProperties}
            onMouseEnter={() => {
                if (isTouch) return;
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
                setExpanded(true);
            }}
            onMouseLeave={() => {
                if (isTouch) return;
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
                hoverTimer.current = window.setTimeout(() => setExpanded(false), hoverCloseDelayMs);
            }}
        >
            <div className="lsc-collapsed" onClick={toggleExpanded}>
                <ManagedImage
                    candidates={collapsedCandidates}
                    initial={collapsedCandidates[0]}
                    expanded={false}
                    className="lsc-thumb"
                    noImageThumb={noImageThumb}
                />
            </div>

            <div
                className="lsc-panel-wrap"
                style={{
                    left: expandToRight ? `calc(var(--lsc-collapsed) + var(--lsc-panel-gap))` : undefined,
                    right: expandToRight ? undefined : `calc(var(--lsc-collapsed) + var(--lsc-panel-gap))`,
                    maxWidth: parentWidth
                        ? `${parentWidth - (x + cfg.collapsed) - panelGap - parentGap}px`
                        : undefined,
                }}
            >
                <div className={`lsc-panel ${expanded ? "is-open" : ""}`}>
                    {defaultItem && (
                        <div
                            className="lsc-tile"
                            onClick={() => {
                                setSelectedId(defaultItem.id);
                                onDefault(defaultItem);
                                setExpanded(false);
                            }}
                        >
                            <ManagedImage
                                candidates={[defaultThumb]}
                                initial={defaultThumb}
                                expanded={expanded}
                                className="lsc-t-thumb"
                                noImageThumb={noImageThumb}
                            />
                            <div className="lsc-title">Default</div>
                            <div className="lsc-desc">Initial Content</div>
                        </div>
                    )}

                    <div className="lsc-scroll-wrap">
                        {canScrollLeft && (
                            <div className="lsc-arrow lsc-arrow-left" onClick={() => scrollBy(-1)}>❮</div>
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
                            <div className="lsc-arrow lsc-arrow-right" onClick={() => scrollBy(1)}>❯</div>
                        )}
                    </div>

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
    );
};
