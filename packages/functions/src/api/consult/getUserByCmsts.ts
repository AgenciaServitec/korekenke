// import { firestore } from "../../_firebase";
//
// export const getUserByCmsts = (req, res): Promise<void> => {
//   const { cip } = req.params;
//
//   getUserByCip(cip)
//     res.end();
// };
//
// const getUserByCip = (cip) => {
//   const user = firestore.collection("users").where("cip", "==", cip);
//
//   return user;
// };
