import React, { createElement, useState, useRef, ReactElement } from "react";
import { DynamicValue, WebIcon } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum } from "typings/SearchableEnumerationSelectorProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import usePositionUpdate, { mapPosition, Position } from "../custom hooks/usePositionUpdate";
import { EnumOption } from "typings/general";
import focusSearchInput from "../utils/focusSearchInput";
import handleKeyNavigation from "../utils/handleKeyNavigation";
import handleClear from "../utils/handleClear";

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

    usePositionUpdate(sesRef, newPosition => {
        setPosition(newPosition);
    });

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
            onKeyDown={event =>
                handleKeyNavigation(event, focusedEnumIndex, setFocusedEnumIndex, options, onSelectHandler, setShowMenu)
            }
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
            {currentValue !== undefined && (
                <span className="ses-text">{options.find(option => option.name === currentValue)?.caption}</span>
            )}
            <div className="ses-icon-row">
                {isClearable && isReadOnly === false && (
                    <ClearIcon
                        onClick={event =>
                            handleClear(
                                event,
                                mxFilter,
                                setMxFilter,
                                setFocusedEnumIndex,
                                onSelectHandler,
                                searchInput,
                                setShowMenu
                            )
                        }
                        title={"Clear"}
                        mxIconOverride={clearIcon}
                    />
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
