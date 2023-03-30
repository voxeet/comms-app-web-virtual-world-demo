import React from "react";

import style from "./ActionButton.Style";

const ActionButton = ({ className, children, action, ...rest }) => (
  <svg className={className} {...rest} onClick={action}>
    {children}
  </svg>
);

export default style(ActionButton);
