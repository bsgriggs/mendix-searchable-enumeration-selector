import React, { createElement, useState, useRef, ReactElement } from "react";
import { DynamicValue, WebIcon } from "mendix";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum } from "typings/SearchableEnumerationSelectorProps";
import ClearIcon from "./icons/ClearIcon";
import {EnumOption} from "typings/general";

interface EnumListProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    options: EnumOption[];
    currentValue?: string;
    onSelectEnum: (newEnumValue: string | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    isSearchable: boolean;
    isReadOnly: boolean;
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

const EnumList = ({
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
    noResultsText,
    placeholder,
    tabIndex
}: EnumListProps): ReactElement => {
    const [focusedEnumIndex, setFocusedEnumIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const sesRef = useRef(null);

    const onSelectHandler = (selectedEnum: string | undefined): void => {
        if (currentValue === selectedEnum && isClearable) {
            onSelectEnum(undefined);
        } else {
            onSelectEnum(selectedEnum);
        }
        setMxFilter("");
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedEnumIndex(0);
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
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (focusedEnumIndex === -1) {
                setFocusedEnumIndex(0);
            } else if (focusedEnumIndex < options.length - 1) {
                setFocusedEnumIndex(focusedEnumIndex + 1);
            } else {
                setFocusedEnumIndex(0);
            }
        } else if (keyPressed === "Enter") {
            if (focusedEnumIndex > -1) {
                onSelectHandler(options[focusedEnumIndex]?.name);
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            setFocusedEnumIndex(-1);
        }
    };

    const handleClear = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation();
        setMxFilter("");
        setFocusedEnumIndex(-1);
        if (mxFilter.trim() === "") {
            onSelectHandler(undefined);
        }
       focusSearchInput(sesRef, 300);
    };

    return (
        <React.Fragment>
            {isSearchable && (
                <div className={"form-control"} tabIndex={tabIndex || 0} onKeyDown={handleInputKeyDown} ref={sesRef}>
                    <input
                        name={name}
                        placeholder={placeholder}
                        type="text"
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        value={mxFilter}
                        ref={searchInput}
                    ></input>

                    {isClearable && isReadOnly === false && (
                        <ClearIcon onClick={handleClear} title={"Clear"} mxIconOverride={clearIcon} />
                    )}
                </div>
            )}
            <div className="form-control ses-selectable-list">
                <OptionsMenu
                    onSelectOption={(newEnumValue: string | undefined) => {
                        onSelectHandler(newEnumValue);
                    }}
                    currentValue={currentValue}
                    currentFocus={options[focusedEnumIndex]?.name}
                    noResultsText={noResultsText}
                    optionsStyle={optionsStyle}
                    selectStyle={"list"}
                    isReadyOnly={isReadOnly}
                    options={options}
                />
                {isSearchable === false && isClearable && isReadOnly === false && (
                    <ClearIcon onClick={handleClear} title={"Clear"} mxIconOverride={clearIcon} />
                )}
            </div>
        </React.Fragment>
    );
};

export default EnumList;
