type OmitDefaultFirestoreProps<T> = Omit<T, keyof DefaultFirestoreProps>;

interface DefaultFirestoreProps {
  createAt: FirebaseFirestore.Timestamp;
  updateAt: FirebaseFirestore.Timestamp;
  deleteAt: FirebaseFirestore.Timestamp;
  isDeleted: boolean;
}
