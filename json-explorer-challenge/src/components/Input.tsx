import { InputHTMLAttributes } from "react";

export default function Input(
  props: InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: Required<InputHTMLAttributes<HTMLInputElement>["id"]>;
  }
) {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <br />
      <input {...props} className="border border-radius p-1" />
    </div>
  );
}
