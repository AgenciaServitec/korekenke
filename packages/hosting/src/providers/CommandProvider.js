import React, { createContext, useContext, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { isString } from "lodash";
import { InitialEntities } from "../data-list";

const CommandContext = createContext({
  currentCommand: null,
  onChangeCommand: (commandId) => console.info(commandId),
  onNavigateInCommand: () => console.info(),
});

export const CommandProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuthentication();

  const commands = InitialEntities?.[0]?.organs?.[0]?.commands || [];

  const commandFromUrl =
    authUser && findCommandFromUrl(location.pathname, authUser.commands);

  const [command, setCommand] = useState(
    commandFromUrl || authUser?.initialCommand || null
  );

  const [commandId] = location.pathname.slice(1).split("/");

  const currentCommandId = isCommandId(commandId, commands)
    ? commandId
    : "copere";

  const onChangeCommand = (commandId) => {
    const command = commands.find((command) => command.id === commandId);

    if (command) {
      setCommand(command);

      const regex = new RegExp(`/${currentCommandId}/`, "g");

      const newPathname =
        location.pathname === "/" ||
        location.pathname === "/register" ||
        !isCommandId(location.pathname.slice(1).split("/")[0], commands)
          ? `/${commandId}${authUser?.role?.initialPathname || "/home"}`
          : location.pathname.replace(regex, `/${commandId}/`);

      navigate(newPathname + location.search);
    }
  };

  const onNavigateInCommand = (commandId) => {
    commandId && onChangeCommand(commandId);
  };

  return (
    <CommandContext.Provider
      value={{
        currentCommand: command ? mapCurrentCommand(command) : null,
        onChangeCommand,
        onNavigateInCommand,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => useContext(CommandContext);

const mapCurrentCommand = (command) => ({
  ...command,
});

const findCommandFromUrl = (pathname, commands = []) => {
  const commandId = pathname.slice(1).split("/")[0];

  return commands.find((command) => command.id === commandId);
};

const isCommandId = (data, commands) =>
  isString(data) &&
  (
    commands?.map((comand) => comand.id) || [
      "copere",
      "coede",
      "cologe",
      "cogae",
    ]
  ).includes(data);
