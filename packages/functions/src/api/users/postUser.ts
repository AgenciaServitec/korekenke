import { auth, fetchCollection, firestore } from "../../_firebase";
import {
  defaultFirestoreProps,
  getTypeForAssignedToByRoleCode,
} from "../../utils";
import { NextFunction, Request, Response } from "express";
import { isEmpty, orderBy } from "lodash";
import { Timestamp } from "@google-cloud/firestore";
import { INITIAL_HIGHER_ENTITIES } from "../../data-list";

const commands = INITIAL_HIGHER_ENTITIES?.[0]?.organs?.[0]?.commands || [];

export const postUser = async (
  req: Request<unknown, unknown, User, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { body: user } = req;

  console.log("「Add user」Initialize", {
    params: req.params,
    body: req.body,
  });

  try {
    const _isEmailExists = await isEmailExists(user?.email);
    if (_isEmailExists) {
      res.status(412).send("user/email_already_exists").end();
      return;
    }

    const _isCipExists = await isCipExists(user?.cip);
    if (_isCipExists) {
      res.status(412).send("user/cip_already_exists").end();
      return;
    }

    const _isDniExists = await isDniExists(user?.dni);
    if (_isDniExists) {
      res.status(412).send("user/dni_already_exists").end();
      return;
    }

    const _isPhoneNumberExists = await isPhoneNumberExists(user?.phone.number);
    if (_isPhoneNumberExists) {
      res.status(412).send("user/phone_number_already_exists").end();
      return;
    }

    const userId = firestore.collection("users").doc().id;

    await addUser({ ...user, id: userId });
    await addUserAuth({ ...user, id: userId });

    res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const addUser = async (user: User): Promise<void> => {
  const { assignCreateProps } = defaultFirestoreProps();

  const [initialCommand] = orderBy(
    user?.commands,
    [(command) => command.name],
    ["asc"]
  );

  const defaultCommand = commands.find((command) => command.id === "ep");

  await firestore
    .collection("users")
    .doc(user.id)
    .set(
      assignCreateProps({
        ...user,
        roleCode: user?.roleCode || "user",
        acls: user?.acls || {
          default: {
            home: ["/home"],
            profile: ["/profile"],
          },
        },
        assignedTo: getTypeForAssignedToByRoleCode(user.roleCode)
          ? {
              type: getTypeForAssignedToByRoleCode(user.roleCode),
              id: null,
            }
          : null,
        commands: user?.commands
          ? user.commands.map((command) => ({
              ...command,
              updateAt: Timestamp.now(),
            }))
          : [defaultCommand],
        commandsIds: user?.commandsIds ? user.commandsIds : ["ep"],
        initialCommand: initialCommand || defaultCommand,
        iAcceptPrivacyPolicies: true,
        status: "registered",
      })
    );
};

const addUserAuth = async (user: User): Promise<void> => {
  await auth.createUser({
    uid: user.id,
    phoneNumber: user?.phone
      ? `${user.phone?.prefix || "+51"}${user.phone.number}`
      : undefined,
    email: user?.email || undefined,
    password: user?.password || undefined,
  });
};

const isEmailExists = async (email: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("email", "==", email)
  );

  return !isEmpty(users);
};

const isCipExists = async (cip: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("cip", "==", cip)
  );

  return !isEmpty(users);
};

const isDniExists = async (dni: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("dni", "==", dni)
  );

  return !isEmpty(users);
};

const isPhoneNumberExists = async (number: string | null): Promise<boolean> => {
  const users = await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("phone.number", "==", number)
  );

  return !isEmpty(users);
};
