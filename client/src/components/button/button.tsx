import React from 'react';
import classes from './button.module.css';

interface IButtonProps {
    btnType?: string;
    clicked?: () => void;
    type?: "button" | "submit" | "reset";
    children: string;
}

const Button = (props: IButtonProps) => {

    return(
    <button 
        className={[classes.button, props.btnType ? classes[props.btnType] : ""].join(' ')} 
        onClick={props.clicked}
        type={props.type}>
        {props.children}   
    </button>
    );
}

export default Button;