import React from "react";
import { Button as PaperButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { styles } from '../style/styles';

export default function Button({ mode = "contained", ...props }) {
    return (
        <PaperButton
            style={styles.button}
            labelStyle={styles.buttonText}
            mode={mode}
            {...props}
        />
    );
}

// Definiere PropTypes für mode
Button.propTypes = {
  mode: PropTypes.oneOf(["contained", "outlined", "text"]), // Optional: nur die erlaubten Modi
};