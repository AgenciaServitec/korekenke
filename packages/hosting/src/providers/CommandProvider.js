import React, { createContext, useContext, useState } from "react";
import { useAuthentication } from "./AuthenticationProvider";
import { INITIAL_HIGHER_ENTITIES } from "../data-list";
import { updateUser } from "../firebase/collections";
import { firestoreTimestamp } from "../firebase/firestore";
import { useNavigate } from "react-router";

const CommandContext = createContext({
  currentCommand: null,
  onChangeCommand: (commandId) => console.info(commandId),
  onNavigateInCommand: () => console.info(),
});

export const CommandProvider = ({ children }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();

  const commands = INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands || [];

  const [command, setCommand] = useState(authUser?.initialCommand || null);

  const onChangeCommand = async (commandId = null) => {
    const command = commands.find((command) => command.id === commandId);

    if (!command) return navigate("/home");

    if (command && authUser) {
      setCommand(command);

      await updateUser(authUser.id, {
        commands: [
          ...authUser.commands.filter((_command) => _command.id !== command.id),
          { ...command, updateAt: firestoreTimestamp.now() },
        ],
        initialCommand: command,
      });

      const newPathname =
        location.pathname === "/" || location.pathname === "/register"
          ? "/home"
          : location.pathname;

      navigate(newPathname + location.search);
    }
  };

  const onNavigateInCommand = (commandId) => onChangeCommand(commandId);

  return (
    <CommandContext.Provider
      value={{
        currentCommand: command ? mapCurrentCommand(command) : defaultCommand,
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

const defaultCommand = {
  id: "ep",
  code: "ep",
  name: "Ejército del Perú",
  logoImgUrl:
    "https://storage.googleapis.com/korekenke-prod.appspot.com/resources/logo-ep.png",
  entities: [
    {
      id: "departamento_de_apoyo_social",
      name: "DEPARTAMENTO DE APOYO SOCIAL",
    },
  ],
};
