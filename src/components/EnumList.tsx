import React, { createElement, useState, useRef, ReactElement } from "react";
import { DynamicValue, WebIcon } from "mendix";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum } from "typings/SearchableEnumerationSelectorProps";
import ClearIcon from "./icons/ClearIcon";
import { EnumOption } from "typings/general";
import handleKeyNavigation from "../utils/handleKeyNavigation";
import handleClear from "../utils/handleClear";

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

    return (
        <React.Fragment>
            {isSearchable && (
                <div
                    className={"form-control"}
                    tabIndex={tabIndex || 0}
                    onKeyDown={event =>
                        handleKeyNavigation(event, focusedEnumIndex, setFocusedEnumIndex, options, onSelectHandler)
                    }
                    ref={sesRef}
                >
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
                        <ClearIcon
                            onClick={event =>
                                handleClear(
                                    event,
                                    mxFilter,
                                    setMxFilter,
                                    setFocusedEnumIndex,
                                    onSelectHandler,
                                    searchInput
                                )
                            }
                            title={"Clear"}
                            mxIconOverride={clearIcon}
                        />
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
                    <ClearIcon
                        onClick={event =>
                            handleClear(event, mxFilter, setMxFilter, setFocusedEnumIndex, onSelectHandler, searchInput)
                        }
                        title={"Clear"}
                        mxIconOverride={clearIcon}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default EnumList;
