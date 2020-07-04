import React from "react";
import classNames from "classnames";
export const Button = (props) => {
  const classes = classNames(
    "f6 link dim br1 ph3 pv2 mb2 mh2 dib white bg-purple pointer",
    props.className
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