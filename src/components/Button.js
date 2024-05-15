import React from "react";
import { Button as PaperButton } from 'react-native-paper'
import { styles } from '../style/styles';

export default function Button({ mode, style, ...props }) {
    return (
        <PaperButton
            style={styles.button}
            labelStyle={styles.buttonText}
            mode={mode}
            {...props}
        />
    )
}