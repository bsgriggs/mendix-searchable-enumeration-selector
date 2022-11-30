import { SearchableEnumerationSelectorPreviewProps } from "../typings/SearchableEnumerationSelectorProps";
import { hidePropertiesIn } from "./utils/PageEditorUtils";

export type Properties = PropertyGroup[];

export type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

export type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export function getProperties(
    _values: SearchableEnumerationSelectorPreviewProps,
    defaultProperties: Properties
): Properties {
    if (_values.selectStyle === "list") {
        hidePropertiesIn(defaultProperties, _values, ["maxMenuHeight", "dropdownIcon"]);
    }

    if (_values.isClearable === false) {
        hidePropertiesIn(defaultProperties, _values, ["clearIcon"]);
    }

    if (_values.isSearchable === false) {
        hidePropertiesIn(defaultProperties, _values, ["filterDelay"]);
    }

    if (_values.isSearchable === false && _values.selectStyle === "list") {
        hidePropertiesIn(defaultProperties, _values, ["placeholder"]);
    }

    return defaultProperties;
}

export function check(_values: SearchableEnumerationSelectorPreviewProps): Problem[] {
    const errors: Problem[] = [];
    if (_values.filterDelay === null || _values.filterDelay < 0) {
        errors.push({
            property: `filterDelay`,
            message: `Filter Delay must be greater than or equal to 0`,
            url: "https://github.com/bsgriggs/mendix-searchable-enumeration-selector"
        });
    }

    return errors;
}
