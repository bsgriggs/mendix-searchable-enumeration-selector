/**
 * This file was generated from SearchableEnumerationSelector.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, EditableValue, WebIcon } from "mendix";

export type SelectStyleEnum = "dropdown" | "list";

export type OptionsStyleEnum = "cell" | "checkbox";

export interface SearchableEnumerationSelectorContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    isSearchable: boolean;
    isClearable: boolean;
    filterDelay: number;
    selectStyle: SelectStyleEnum;
    optionsStyle: OptionsStyleEnum;
    maxMenuHeight: DynamicValue<string>;
    noResultsText: DynamicValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    enumAttribute: EditableValue<string>;
    onChange?: ActionValue;
}

export interface SearchableEnumerationSelectorPreviewProps {
    readOnly: boolean;
    placeholder: string;
    isSearchable: boolean;
    isClearable: boolean;
    filterDelay: number | null;
    selectStyle: SelectStyleEnum;
    optionsStyle: OptionsStyleEnum;
    maxMenuHeight: string;
    noResultsText: string;
    clearIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    dropdownIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    enumAttribute: string;
    onChange: {} | null;
}
