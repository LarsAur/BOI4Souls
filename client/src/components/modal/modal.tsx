import React from 'react';
import Button from '../button/button';

import classes from './modal.module.css';

interface IModalProps {
    handleClose: () => void
    display: boolean
    title?: string
}

export default class Modal extends React.Component<IModalProps>{
    render(): JSX.Element {
        return (
            <div className={classes.modal + (this.props.display ? "" : " noDisplay")}>
                <div className={classes.modalContent}>
                    {this.props.children}

                    <span className={classes.controlBar}><Button clicked={this.props.handleClose}>Apply</Button></span>
                </div>
            </div>
        );
    }
}