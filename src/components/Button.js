import React from "react";
import { Button as PaperButton } from 'react-native-paper'
// import { Button as PaperButton } from "react-native-elements";
import { styles } from '../style/styles';

export default function Button({ mode="contained", style, ...props }) {
    return (
        <PaperButton
            style={styles.button}
            labelStyle={styles.buttonText}
            mode={mode}
            {...props}
        />
    )
}