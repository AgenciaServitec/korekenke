// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectType = { [field: string]: any };

type FirestoreFieldValue<T> = {
  [P in keyof T]: T[P] | FirebaseFirestore.FieldValue;
};

type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;

type PromiseReject = (reason?: unknown) => void;

type OmitDefaultFirestoreProps<T> = Omit<T, keyof DefaultFirestoreProps>;

interface DefaultFirestoreProps {
  createAt: FirebaseFirestore.Timestamp;
  updateAt: FirebaseFirestore.Timestamp;
  deleteAt: FirebaseFirestore.Timestamp;
  isDeleted: boolean;
}
