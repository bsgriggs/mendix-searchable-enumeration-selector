import { createElement, ReactElement } from "react";
import { IconProps } from "typings/general";
import { Icon } from "mendix/components/web/Icon";

const ClearIcon = (props: IconProps): ReactElement =>
    props.mxIconOverride !== undefined ? (
        <div onClick={props.onClick} title={props.title}>
            <Icon icon={props.mxIconOverride.value} altText={props.title} />
        </div>
    ) : (
        <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={props.onClick} title={props.title} />
    );

export default ClearIcon;
