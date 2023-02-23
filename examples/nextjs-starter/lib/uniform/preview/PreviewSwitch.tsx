import { useRouter } from "next/router";

function PreviewSwitch({ previewing }: { previewing: boolean }) {
  const router = useRouter();
  // Usually you won't expose secret to front-end bundle,
  // and regular env variable is not available on front-end,
  // but for the sake of this starter we are doing it :)
  const previewSecret = process.env.UNIFORM_PREVIEW_SECRET || 'hello-world';
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
