import { MouseEvent, RefObject } from "react";
import focusSearchInput from "./focusSearchInput";

export default function handleClear(
    event: MouseEvent<HTMLSpanElement>,
    mxFilter: string,
    setMxFilter: (newFilter: string) => void,
    setFocusedEnumIndex: (newIndex: number) => void,
    onSelectHandler: (selectedEnum: string | undefined, closeMenu?: boolean) => void,
    searchInput: RefObject<HTMLInputElement>,
    setShowMenu?: (newShowMenu: boolean) => void
): void {
    event.stopPropagation();
    if (setShowMenu !== undefined) {
        setShowMenu(true);
    }
    setMxFilter("");
    setFocusedEnumIndex(-1);
    if (mxFilter.trim() === "") {
        onSelectHandler(undefined, false);
    }
    focusSearchInput(searchInput, 300);
}
