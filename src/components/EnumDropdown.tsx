import React, { createElement, useState, useRef, ReactElement } from "react";
import { DynamicValue, WebIcon } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu, { Position } from "./OptionsMenu";
import { OptionsStyleEnum } from "typings/SearchableEnumerationSelectorProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import usePositionUpdate, {mapPosition} from "../custom hooks/usePositionUpdate";
import {EnumOption} from "typings/general";

interface EnumDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    options: EnumOption[];
    currentValue?: string;
    onSelectEnum: (enumValue: string | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    isSearchable: boolean;
    isReadOnly: boolean;
    maxHeight?: string;
    optionsStyle: OptionsStyleEnum;
}

const focusSearchInput = (input: React.RefObject<HTMLInputElement>, delay: number): void => {
    if (input.current !== null) {
        if (delay !== undefined){
            setTimeout(()=> input.current?.focus(), delay);
        } else {
            input.current.focus();
        }
    }
};

const EnumDropdown = ({
    isClearable,
    isReadOnly,
    isSearchable,
    mxFilter,
    name,
    onSelectEnum,
    options,
    optionsStyle,
    setMxFilter,
    clearIcon,
    currentValue,
    dropdownIcon,
    maxHeight,
    noResultsText,
    placeholder,
    tabIndex
}: EnumDropdownProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedEnumIndex, setFocusedEnumIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const sesRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0, w: 0, h: 0 });

    usePositionUpdate(sesRef, (newPosition => {
        setPosition(newPosition)
    }));

    useOnClickOutside(sesRef, () => {
        // handle click outside
        setShowMenu(false);
        setFocusedEnumIndex(-1);
    });

    const onSelectHandler = (selectedEnum: string | undefined, closeMenu: boolean): void => {
        if (currentValue === selectedEnum && isClearable) {
            onSelectEnum(undefined);
        } else {
            onSelectEnum(selectedEnum);
        }
        setMxFilter("");
        if (closeMenu) {
            setShowMenu(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedEnumIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && showMenu === false) {
            setShowMenu(true);
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const keyPressed = event.key;
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (focusedEnumIndex === -1) {
                setFocusedEnumIndex(0);
            } else if (focusedEnumIndex > 0) {
                setFocusedEnumIndex(focusedEnumIndex - 1);
            } else {
                setFocusedEnumIndex(options.length - 1);
            }
            setShowMenu(true);
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (focusedEnumIndex === -1) {
                setFocusedEnumIndex(0);
            } else if (focusedEnumIndex < options.length - 1) {
                setFocusedEnumIndex(focusedEnumIndex + 1);
            } else {
                setFocusedEnumIndex(0);
            }
            setShowMenu(true);
        } else if (keyPressed === "Enter") {
            if (focusedEnumIndex > -1) {
                onSelectHandler(options[focusedEnumIndex]?.name, true);
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            setFocusedEnumIndex(-1);
            setShowMenu(false);
        }
    };

    const handleClear = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation();
        setShowMenu(true);
        setMxFilter("");
        setFocusedEnumIndex(-1);
        if (mxFilter.trim() === "") {
            onSelectHandler(undefined, false);
        }
        focusSearchInput(searchInput, 300);
    };

    return (
        <div
            className={showMenu ? "form-control active" : "form-control"}
            tabIndex={tabIndex || 0}
            onClick={() => {
                setShowMenu(!showMenu);
                setPosition(mapPosition(sesRef.current));
                if (showMenu === false) {
                    focusSearchInput(searchInput, 300);
                }
            }}
            onKeyDown={handleInputKeyDown}
            ref={sesRef}
        >
            {currentValue === undefined && isReadOnly === false && isSearchable && (
                <input
                    name={name}
                    placeholder={placeholder}
                    type="text"
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    value={mxFilter}
                    ref={searchInput}
                    onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        if (showMenu) {
                            event.stopPropagation();
                        }
                    }}
                ></input>
            )}
            {currentValue === undefined && isSearchable === false && <span className="ses-text">{placeholder}</span>}
            {currentValue !== undefined && <span className="ses-text">{options.find(option => option.name === currentValue)?.caption}</span>}
            <div className="ses-icon-row">
                {isClearable && isReadOnly === false && (
                    <ClearIcon onClick={handleClear} title={"Clear"} mxIconOverride={clearIcon} />
                )}
                <DropdownIcon mxIconOverride={dropdownIcon} />
            </div>
            {showMenu && (
                <OptionsMenu
                    options={options}
                    onSelectOption={(newEnumValue: string | undefined) => {
                        onSelectHandler(newEnumValue, true);
                    }}
                    currentValue={currentValue}
                    currentFocus={options[focusedEnumIndex]?.name}
                    maxHeight={maxHeight}
                    noResultsText={noResultsText}
                    optionsStyle={optionsStyle}
                    selectStyle={"dropdown"}
                    position={position}
                    isReadyOnly={isReadOnly}
                />
            )}
        </div>
    );
};

export default EnumDropdown;
