type RoleCode = "super_admin" | "admin" | "user";

interface User extends DefaultFirestoreProps {
  id: string;
  cip: string;
  password: string | null;
  roleCode: RoleCode;
  firstName: string;
  lastName: string;
  dni: string;
  email: string | null;
  phoneNumber: string | null;
  degree: string;
  cgi: string;
  iAcceptPrivacyPolicies: boolean;
  updateBy?: string;
}

interface Image {
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

interface Correspondence extends DefaultFirestoreProps {
  id: string;
  destination: string;
  receivedBy: string;
  class: string;
  indicative: string;
  classification: string;
  issue: string;
  dateCorrespondence: FirebaseFirestore.Timestamp;
  photo: Image;
}
