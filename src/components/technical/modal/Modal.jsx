import React from "react";
import ReactDOM from "react-dom";
import { X } from "@styled-icons/feather";

import style from "./Modal.Style";

const Modal = ({ className, isShowing, hide, children }) =>
  isShowing
    ? ReactDOM.createPortal(
        <>
          <div className={className}>
            <div className="modal-overlay" />
            <div
              className="modal-wrapper"
              aria-modal
              aria-hidden
              tabIndex={-1}
              role="dialog"
            >
              <div className="modal">
                <X width={24} height={24} onClick={hide} />
                {children}
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;

export default style(Modal);
