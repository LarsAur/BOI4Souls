import React from 'react';
import Button from '../button/button';

import classes from './modal.module.css';

interface IModalProps {
    handleApply: () => void
    handleCancel: () => void
    title?: string
}

export default class Modal extends React.Component<IModalProps>{
    render(): JSX.Element {
        return (
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    {this.props.children}

                    <span className={classes.controlBar}>
                        <Button clicked={this.props.handleCancel}>Cancel</Button>
                        <Button clicked={this.props.handleApply}>Apply</Button>
                    </span>
                </div>
            </div>
        );
    }
}