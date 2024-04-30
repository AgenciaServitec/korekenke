type RoleCode = "super_admin" | "admin" | "functionary" | "user";

interface Role {
  code: RoleCode;
  name: string;
  imgUrl: string;
  updateAt: string;
}

interface User extends DefaultFirestoreProps {
  id: string;
  acls: string[];
  defaultRoleCode: string;
  otherRoles?: Role[];
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string | null;
  cip: string;
  dni: string;
  phone: {
    prefix: string;
    number: string;
  };
  password?: string | null;
  degree: string;
  cgi: string;
  iAcceptPrivacyPolicies: boolean;
  profilePhoto?: Image;
  cipPhoto?: Image;
  dniPhoto?: Image;
  signaturePhoto?: Image;
  address?: boolean;
  civilStatus?: boolean;
  houseLocation?: string;
  placeBirth?: string;
  urbanization?: string;
  emergencyCellPhone?: {
    prefix: string;
    number: string;
  };
  familyMembers?: FamilyMember[];
  updateBy: string;
}

interface FamilyMember {
  age: number;
  cciiffs: string;
  dni: string;
  firstName: string;
  id: string;
  maternalSurname: string;
  paternalSurname: string;
  relationship: string;
}

interface Image {
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

interface Archive {
  name: string;
  status?: string;
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
  photos: Image[];
  files: Archive[];
}
