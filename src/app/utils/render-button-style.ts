export function renderButtonStyle(type: string) {
  switch (type) {
    case "primary":
      return "px-8 py-3 text-3xl font-semibold rounded text-white bg-primary-600";
    case "secondary":
      return "px-8 py-3 text-3xl font-semibold rounded bg-yellow-600 text-gray-900";
    default:
      return "px-8 py-3 text-3xl font-semibold border-2 rounded border-indigo-600 bg-gray-100";
  }
}
