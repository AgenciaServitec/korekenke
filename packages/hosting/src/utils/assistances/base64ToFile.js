export const base64ToFile = (base64String, fileName) => {
  if (!base64String.startsWith("data:")) {
    base64String = "data:image/png;base64," + base64String;
  }
  const [header, base64Data] = base64String.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const bstr = atob(base64Data);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], fileName, { type: mime });
};
