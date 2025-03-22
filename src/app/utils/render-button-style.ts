export function renderButtonStyle(type: string) {
  switch (type) {
    case "primary":
      return "px-8 py-3 text-3xl font-semibold rounded text-white bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700";
    case "secondary":
      return "px-8 py-3 text-3xl font-semibold rounded bg-yellow-600 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-700";
    default:
      return "px-8 py-3 text-3xl font-semibold border-2 rounded border-indigo-600 bg-gray-100 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200";
  }
}
