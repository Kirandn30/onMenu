import TextField, { TextFieldProps } from '@mui/material/TextField';
import "./styles.css"
/* eslint-disable-next-line */

type rhfType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forminput?: any
}
type forminputType = TextFieldProps & rhfType

export function InputField(props: forminputType) {

    return (
        <TextField
            color='primary'
            inputProps={{
                style: { height: "34px", padding: "4px 14px", backgroundColor: "#fbfbff" },
                ...props.forminput
            }}
            {...props}
        />
    );
}


export default InputField;