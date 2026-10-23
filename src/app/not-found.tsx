import ErrorState from "./components/ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="Seite nicht gefunden"
      description="Die gesuchte Seite existiert nicht oder wurde verschoben."
    />
  );
}
