import './input-field.css';
import TextField, { TextFieldProps } from '@mui/material/TextField';
/* eslint-disable-next-line */

type rhfType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forminput?: any
}
type forminputType = TextFieldProps & rhfType

export function InputField(props: forminputType) {
  return (
    <TextField color='primary' inputProps={{ className: 'dos-input', style: { background: 'white' }, ...props.forminput }} {...props} />
  );
}


export default InputField;
