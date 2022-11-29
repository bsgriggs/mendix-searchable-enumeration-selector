import { ReactElement, createElement } from "react";
import { SearchableEnumerationSelectorPreviewProps } from "typings/SearchableEnumerationSelectorProps";
import { WebIcon } from "mendix";
import { Icon } from "mendix/components/web/Icon";
import Option, { focusModeEnum } from "./components/Option";

type iconPreview =
    | {
          type: "glyph";
          iconClass: string;
      }
    | {
          type: "image";
          imageUrl: string;
      }
    | null;

const formatWebIcon = (propsIcon: iconPreview): WebIcon | undefined => {
    if (propsIcon?.type === "glyph") {
        const glyphIcon = { type: propsIcon.type, iconClass: propsIcon.iconClass };
        return glyphIcon;
        // there seems to be a bug with Mendix that the image does not load via url
        // } else if (propsIcon?.type === "image") {
        //     const imgIcon = { type: propsIcon.type, iconUrl: propsIcon.imageUrl };
        //     return imgIcon;
    } else {
        return undefined;
    }
};

const displayIcon = (propsIcon: iconPreview, defaultClassName: string): ReactElement => {
    const webIcon = formatWebIcon(propsIcon);
    return propsIcon !== null && webIcon !== undefined ? (
        <div>
            <Icon icon={webIcon} />
        </div>
    ) : (
        <span className={"glyphicon glyphicon-" + defaultClassName} aria-hidden="true" />
    );
};

export function preview(props: SearchableEnumerationSelectorPreviewProps): ReactElement {
    return (
        <div className="ses">
            <div className="form-control">
                {props.readOnly === false && props.isSearchable && (
                    <input type="text" readOnly={props.readOnly} value={props.enumAttribute}></input>
                )}
                {props.isSearchable === false && <span className="ses-text">{props.enumAttribute}</span>}
                <div className="ses-icon-row">
                    {props.isClearable && props.readOnly === false && displayIcon(props.clearIcon, "remove")}
                    {props.selectStyle === "dropdown" && displayIcon(props.dropdownIcon, "menu-down")}
                </div>
            </div>
            <div
                className={`ses-list`}
                style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d7d7d7",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    padding: "0.25em"
                }}
            >
                <div>
                    <Option
                        index={1}
                        isSelected
                        isFocused={false}
                        isSelectable
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onSelect={() => {}}
                        focusMode={focusModeEnum.hover}
                        optionsStyle={props.optionsStyle}
                        option={{ caption: props.enumAttribute + " 1", name: "enum1" }}
                    />
                    <Option
                        index={2}
                        isSelected={false}
                        isFocused={false}
                        isSelectable
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onSelect={() => {}}
                        focusMode={focusModeEnum.hover}
                        optionsStyle={props.optionsStyle}
                        option={{ caption: props.enumAttribute + " 2", name: "enum2" }}
                    />
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SearchableEnumerationSelector.css");
}
