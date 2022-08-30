import { useRouter } from "next/router";

function PreviewSwitch({ previewing }: { previewing: boolean }) {
  const router = useRouter();
  const previewSecret = "hello-world";
  return (
    <button
      type="button"
      className={`preview-button ${
        previewing ? "preview-button-on" : "preview-button-off"
      }`}
      onClick={() => {
        const url = `/api/preview?slug=${router.asPath}${
          previewing ? "&disable=1" : `&secret=${previewSecret}`
        }`;

        router.push(url);
      }}
    >
      {previewing ? "Turn preview off" : "Turn preview on"}
    </button>
  );
}

export default PreviewSwitch;
