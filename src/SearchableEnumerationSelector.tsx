import { ReactElement, createElement, useState, useEffect } from "react";
import { ValueStatus } from "mendix";
import { SearchableEnumerationSelectorContainerProps } from "../typings/SearchableEnumerationSelectorProps";
import EnumDropdown from "./components/EnumDropdown";
import EnumList from "./components/EnumList";
import { Alert } from "./components/Alert";
import "./ui/SearchableEnumerationSelector.css";
import LoadingSelector from "./components/LoadingSelector";
import { EditableValue, ActionValue } from "mendix";
import { EnumOption } from "typings/general";

const callMxAction = (action?: ActionValue): void => {
    if (action !== undefined && action.canExecute && action.isExecuting === false) {
        action.execute();
    }
};

const onSelectEnumerationHandler = (
    currentValue: string | undefined,
    selectedEnum: string | undefined,
    enumAttribute: EditableValue<string>,
    onChange: ActionValue | undefined
): void => {
    if (currentValue !== selectedEnum) {
        enumAttribute.setValue(selectedEnum);
        callMxAction(onChange);
    }
};

const filterOptions = (mxFilter: string, fullOptions: EnumOption[]): EnumOption[] => {
    if (mxFilter !== undefined && mxFilter.trim().length > 0) {
        const searchTextTrimmed = mxFilter.trim();
        return fullOptions.filter(enumValue => {
            return enumValue.caption.toLowerCase().includes(searchTextTrimmed.toLowerCase());
        });
    } else {
        return fullOptions;
    }
};

export function SearchableEnumerationSelector({
    id,
    name,
    selectStyle,
    tabIndex,
    isClearable,
    clearIcon,
    dropdownIcon,
    isSearchable,
    enumAttribute,
    filterDelay,
    maxMenuHeight,
    noResultsText,
    optionsStyle,
    placeholder,
    onChange
}: SearchableEnumerationSelectorContainerProps): ReactElement {
    const [mxFilter, setMxFilter] = useState<string>("");
    const [options, setOptions] = useState<EnumOption[]>([]);
    const [fullOptions, setFullOptions] = useState<EnumOption[]>([]);

    useEffect(() => {
        if (enumAttribute.universe != undefined) {
            const captions = enumAttribute.universe.map(name => enumAttribute.formatter.format(name));
            const newFullOptions = enumAttribute.universe.map((value, index) => {
                return {
                    caption: captions[index],
                    name: value
                };
            });
            setFullOptions(newFullOptions);
            setOptions(filterOptions(mxFilter, newFullOptions));
        }
    }, [enumAttribute.universe]);

    useEffect(() => {
        if (
            enumAttribute.status === ValueStatus.Available &&
            placeholder.status === ValueStatus.Available &&
            maxMenuHeight.status === ValueStatus.Available
        ) {
            const delayDebounceFn = setTimeout(() => {
                if (isSearchable) {
                    setOptions(filterOptions(mxFilter, fullOptions));
                }
            }, filterDelay);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [mxFilter, filterDelay, isSearchable, fullOptions]);

    if (
        enumAttribute.status === ValueStatus.Available &&
        placeholder.status === ValueStatus.Available &&
        maxMenuHeight.status === ValueStatus.Available
    ) {
        return (
            <div id={id} className="ses">
                {selectStyle === "dropdown" && (
                    <EnumDropdown
                        name={name}
                        tabIndex={tabIndex}
                        currentValue={enumAttribute.value}
                        isClearable={isClearable}
                        clearIcon={clearIcon}
                        dropdownIcon={dropdownIcon}
                        onSelectEnum={(newEnumValue: string | undefined) =>
                            onSelectEnumerationHandler(enumAttribute.value, newEnumValue, enumAttribute, onChange)
                        }
                        placeholder={placeholder.value}
                        isReadOnly={enumAttribute.readOnly}
                        isSearchable={isSearchable}
                        maxHeight={maxMenuHeight.value}
                        noResultsText={noResultsText.value}
                        mxFilter={mxFilter}
                        setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                        optionsStyle={optionsStyle}
                        options={options}
                    />
                )}
                {selectStyle === "list" && (
                    <EnumList
                        name={name}
                        tabIndex={tabIndex}
                        currentValue={enumAttribute.value}
                        isClearable={isClearable}
                        clearIcon={clearIcon}
                        onSelectEnum={(newEnumValue: string | undefined) =>
                            onSelectEnumerationHandler(enumAttribute.value, newEnumValue, enumAttribute, onChange)
                        }
                        placeholder={placeholder.value}
                        isReadOnly={enumAttribute.readOnly}
                        noResultsText={noResultsText.value}
                        mxFilter={mxFilter}
                        setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                        optionsStyle={optionsStyle}
                        isSearchable={isSearchable}
                        options={options}
                    />
                )}

                {enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
            </div>
        );
    } else {
        return (
            <LoadingSelector
                name={name}
                tabIndex={tabIndex}
                placeholder={placeholder.value}
                isClearable={isClearable}
                clearIcon={clearIcon}
                dropdownIcon={dropdownIcon}
            />
        );
    }
}
