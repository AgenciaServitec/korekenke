type RoleCode = "super_admin" | "admin" | "functionary" | "user";

interface Role {
  code: RoleCode;
  name: string;
  imgUrl: string;
  updateAt: string;
}

interface Command {
  id: string;
  code: string;
  name: string;
  logoImgUrl: string;
  updateAt: FirebaseFirestore.Timestamp;
}

interface User extends DefaultFirestoreProps {
  id: string;
  acls: string[];
  roleCode: string;
  otherRoles?: Role[];
  commandsIds: string[];
  commands: Command[];
  initialCommand: Command | null;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  cip: string;
  dni: string;
  birthdate: string;
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
  assignedTo: AssignedTo | null;
  updateBy: string;
  holidayDays: number;
  fingerprintTemplate: string | null;
  workPlace: string | null;
}

interface AssignedTo {
  type: "entity" | "department" | "section" | "office";
  id: string | null;
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

interface CmstsEnrollments extends DefaultFirestoreProps {
  id: string;
  status: string;
  userCip: string;
  userId: string;
  createBy: string;
  updateBy: string;
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

interface DasApplication {
  id: string;
  applicant: Applicant;
  familiar?: Familiar;
  headline?: Headline;
  institution: Institution;
  isDeleted: boolean;
  isHeadline: boolean;
  requestType: string;
  wasRead: boolean;
  response?: Response;
  userId?: string;
  status: string;
  createAt: string;
  createBy: string;
  updateAt: string;
  updateBy: string;
}

interface MilitaryRecruiment {
  id: string;
  dni: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  gender: string;
  phone: {
    prefix: string;
    number: string;
  };
  email: string;
  educationLevel: string;
  location: {
    latitude: string;
    longitude: string;
  } | null;
  response?: Response;
  status: string;
  isDeleted: boolean;
  createAt: string;
  createBy: string;
  updateAt: string;
  updateBy: string;
}

interface Institution {
  id: string;
  processType: string;
  specialty: string;
  type: string;
}

interface Response {
  documents: Archive[];
  message: string;
  type: string;
}

interface Applicant {
  documents: {
    copyBoletaPagoMatriculaUniv?: Document | null;
    copyCifFamiliar?: Document | null;
    copyCipHeadline?: Document | null;
    copyConsolidadoNotasUniv?: Document | null;
    copyConstanciaIngresoUniv?: Document | null;
    copyDniFamiliar?: Document | null;
    copyDniHeadline?: Document | null;
    copyLiquidacionHaberesHeadline?: Document | null;
    copyUltimaBoletaPagoUniv?: Document | null;
    signaturePhoto?: Document | null;
  };
  to: string;
}

interface Headline {
  id: string;
  cip: string;
  currentService: string;
  degree: string;
  email: string;
  firstName: string;
  maternalSurname: string;
  paternalSurname: string;
  phone: {
    number: string;
    prefix: string;
  };
}

interface Familiar {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  cif?: string;
  email: string;
  relationship: string;
}

interface Document {
  label: string;
  name: string;
  numberCopies: number;
  uid: string;
  url: string;
}

interface SessionVerification {
  id: string;
  type: "email" | "sms";
  userId: string;
  email: string;
  verifyCode: string;
  isVerified: false;
  createAt: FirebaseFirestore.Timestamp;
}

interface Assistance extends DefaultFirestoreProps {
  id: string;
  createAtString: string;
  createBy: string;
  entry: { date: string; dateTimestamp: FirebaseFirestore.Timestamp } | null;
  outlet: { date: string } | null;
  updateBy: string;
  userId: string;
  user: User;
  workPlace: string | null;
}
