import React, { createElement, ReactElement, useEffect, useRef, useState } from "react";
import Option, { focusModeEnum } from "./Option";
import { OptionsStyleEnum, SelectStyleEnum } from "typings/SearchableEnumerationSelectorProps";
import { EnumOption } from "typings/general";

export interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface OptionsMenuProps {
    options: EnumOption[];
    currentValue?: string;
    currentFocus?: string;
    onSelectOption: (selectedEnum: string) => void;
    noResultsText?: string;
    maxHeight?: string;
    optionsStyle: OptionsStyleEnum;
    selectStyle: SelectStyleEnum;
    position?: Position;
    isReadyOnly: boolean;
}

const OptionsMenuStyle = (selectStyle: SelectStyleEnum, position: Position | undefined, maxHeight: string | undefined): React.CSSProperties => {
    if (selectStyle === "dropdown" && position !== undefined) {
        const contentCloseToBottom = position.y > window.innerHeight * 0.7;
        return {
            maxHeight: maxHeight ? maxHeight : "15em",
            top: contentCloseToBottom ? "unset" : position.h + position.y,
            bottom: contentCloseToBottom ? window.innerHeight - position.y : "unset",
            width: position.w,
            left: position.x
        };
    } else {
        return {};
    }
};

const OptionsMenu = ({
    isReadyOnly,
    onSelectOption,
    options,
    optionsStyle,
    selectStyle,
    currentFocus,
    currentValue,
    maxHeight,
    noResultsText,
    position
}: OptionsMenuProps): ReactElement => {
    const selectedEnumRef = useRef<HTMLDivElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        currentFocus !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        if (selectedEnumRef.current) {
            selectedEnumRef.current.scrollIntoView({ block: "center" });
        }
        setFocusMode(focusModeEnum.arrow);
    }, [currentFocus]);



    return (
        <div
            className={`ses-${selectStyle}`}
            style={OptionsMenuStyle(selectStyle,position,maxHeight)}
            onMouseEnter={() => setFocusMode(focusModeEnum.hover)}
        >
            {options !== undefined && options.length > 0 && (
                <React.Fragment>
                    {options.map((enumOption, key) => {
                        const isFocused = enumOption.name === currentFocus;
                        return (
                            <div key={key} ref={isFocused ? selectedEnumRef : undefined}>
                                <Option
                                    index={key}
                                    isSelected={enumOption.name === currentValue}
                                    isFocused={focusMode === focusModeEnum.arrow ? isFocused : false}
                                    isSelectable={isReadyOnly === false}
                                    onSelect={(newOption: string) => onSelectOption(newOption)}
                                    focusMode={focusMode}
                                    optionsStyle={optionsStyle}
                                    option={enumOption}
                                />
                            </div>
                        );
                    })}
                </React.Fragment>
            )}
            {options === undefined ||
                (options.length === 0 && (
                    <div className="mx-text ses-infooption" role="option">
                        {noResultsText ? noResultsText : "No results found"}
                    </div>
                ))}
        </div>
    );
};

export default OptionsMenu;
