// interface Props extends ContactCommon {
//   contactId: string;
//   createAt: FirestoreTimestamp;
// }
//
// export const searchData = (contact: Props): string[] => {
//   const strings = [
//     contact.contactId,
//     contact.clientCode,
//     ...contact.firstName.split(" "),
//     ...contact.lastName.split(" "),
//     `${contact?.phone?.countryCode}${contact?.phone?.number}`.trim(),
//     contact?.phone?.number,
//     contact.email,
//     contact?.hostname || "",
//     contact.status || "pending",
//     moment(contact.createAt).day(-1).format("DD/MM/YYYY"),
//   ]
//     .filter((string) => string)
//     .map((string) => string.toString());
//
//   console.log("[search data]", strings);
//
//   return uniq(strings);
// };

// export const searchDataGeneric = (
//   contact: Omit<GenericContact, "searchData">
// ): string[] => {
//   return [
//     contact.id,
//     contact.clientId,
//     ...contact.firstName.split(" "),
//     ...contact.lastName.split(" "),
//     `${contact?.phone?.countryCode}${contact?.phone?.number}`.trim(),
//     contact?.phone?.number,
//     contact.email,
//     contact?.hostname || "",
//     contact.status,
//     moment(contact.createAt).format("YYYY-MM-DD"),
//   ]
//     .filter((string) => string)
//     .map((string) => string.toString());
// };
