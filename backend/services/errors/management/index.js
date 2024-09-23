

export function manageUnhandledServerError(error) {
  console.log("Unhandled server error", error, error.stack);
}