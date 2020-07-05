import React from "react";
import classNames from "classnames";
export const Button = (props) => {
  const classes = classNames(
    "f6 br1 ph3 pv2 mb2 mh2 dib white bg-purple pointer noselect",
    props.className,
    {
      "o-50": props.disabled,
      "link": !props.disabled
    }
  );
  return (
    <button 
      {...props}
      className={classes}
      >
      {props.children}
    </button>
  )
};