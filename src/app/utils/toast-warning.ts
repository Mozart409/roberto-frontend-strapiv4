import toast from "react-hot-toast";

// react-hot-toast has no warning type, so style a plain toast as one.
export function toastWarning(message: string) {
  return toast(message, {
    icon: "⚠️",
    className: "border-2 border-amber-500",
  });
}
