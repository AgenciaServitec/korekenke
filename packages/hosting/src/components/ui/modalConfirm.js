import { Modal } from "antd";

// interface Props {
//     centered?: boolean;
//     title?: string;
//     okText?: string;
//     cancelText?: string;
//     okButtonProps?: BaseButtonProps;
//     onOk?: () => void;
//     content?: string;
// }

const { confirm } = Modal;

export const modalConfirm = ({
  centered = true,
  title = "¿Estás seguro de que quieres eliminar?",
  content = "",
  okText = "SI",
  cancelText = "NO",
  okButtonProps = {
    type: "primary",
    danger: true,
  },
  ...props
}) =>
  confirm({
    centered,
    okText,
    cancelText,
    okButtonProps,
    title,
    content,
    ...props,
  });
