export const commandsViewByUser = (commands) =>
  commands
    .map((command) => command.id)
    .join(" - ")
    .toUpperCase();
