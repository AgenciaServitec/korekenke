import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { isString } from "lodash";
import { INITIAL_HIGHER_ENTITIES } from "../data-list";
import { updateUser } from "../firebase/collections";
import { firestoreTimestamp } from "../firebase/firestore";

const CommandContext = createContext({
  currentCommand: null,
  onChangeCommand: (commandId) => console.info(commandId),
  onNavigateInCommand: () => console.info(),
});

export const CommandProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuthentication();

  const commands = INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands || [];

  const commandFromUrl =
    authUser && findCommandFromUrl(location.pathname, authUser.commands);

  const [command, setCommand] = useState(
    commandFromUrl || authUser?.initialCommand || null
  );

  const [commandId] = location.pathname.slice(1).split("/");

  const currentCommandId = isCommandId(commandId, commands)
    ? commandId
    : "copere";

  useEffect(() => {
    authUser?.initialCommand && onChangeCommand(authUser.initialCommand.id);
  }, [authUser?.initialCommand.id]);

  const onChangeCommand = async (commandId) => {
    const command = commands.find((command) => command.id === commandId);

    if (command && authUser) {
      setCommand(command);

      await updateUser(authUser.id, {
        commands: [
          ...authUser.commands.filter((_command) => _command.id !== command.id),
          { ...command, updateAt: firestoreTimestamp.now() },
        ],
        initialCommand: command,
      });

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
