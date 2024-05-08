import { Button, Form } from "antd"
import OtpInput from "react-otp-input"
import themeconfig from "@assets/data/themeConfig"

const primary = themeconfig.color

const OtpField = (props: TProps) => {
  const { otp, setOtp, loading } = props
  return (
    <>
      <div className="mt-1">
        <Form.Item>
          <OtpInput
            value={otp ?? ""}
            onChange={setOtp}
            numInputs={6}
            containerStyle={{ justifyContent: "space-around" }}
            renderSeparator={<span style={{ width: "8px" }}></span>}
            renderInput={(props, id) => (
              <input
                id={`input-${id + 1}`}
                {...props}
                className="otp-box"
                style={{
                  ...props.style,
                  outlineColor: "#34a353bf",
                  caretColor: primary
                }}
              />
            )}
            inputType="number"
            shouldAutoFocus={true}
            inputStyle={{
              border: `1px dashed ${otp === null ? "red" : primary}`,
              borderRadius: "0.357rem",
              width: "36px",
              height: "36px",
              fontSize: "24px",
              fontWeight: "600"
            }}
          />
        </Form.Item>
        <Button
          id="submit-otp"
          type="primary"
          loading={loading}
          className="mt-1"
          htmlType="submit"
          block
        >
          Submit
        </Button>
      </div>
    </>
  )
}

export default OtpField

type TProps = {
  otp: null | string
  setOtp: React.Dispatch<React.SetStateAction<string | null>>
  loading: boolean
}
