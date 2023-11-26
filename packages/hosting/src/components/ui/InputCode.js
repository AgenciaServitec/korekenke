import OTPInput from "react-otp-input";
import styled from "styled-components";
import { ComponentContainer } from "./component-container";

export const InputCode = ({
  value,
  required = false,
  hidden = false,
  error,
  label,
  variant = "filled",
  type = "number",
  disabled,
  animation,
  helperText,
  onChange,
  ...props
}) => {
  return (
    <Container>
      {label && (
        <div className="label">
          <label>{label}</label>
        </div>
      )}
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
        inputStyle="inputStyle"
        inputType={type}
        disabled={disabled}
        allowClear={!disabled}
        {...props}
      />
    </Container>
  );
};

const Container = styled.div`
  .label {
    margin-bottom: 1rem;
  }
  .inputStyle {
    width: 3rem !important;
    height: 3rem;
    margin: 0 1rem;
    font-size: 2rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
  }
`;
