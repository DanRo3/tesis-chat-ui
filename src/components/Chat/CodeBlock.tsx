import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeBlock: React.FC<{ language: string; value: string }> = ({
  language,
  value,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Restablece el texto después de 2 segundos
    });
  };

  return (
    <div className="relative overflow-x-auto my-2">
      <SyntaxHighlighter
        language={language}
        style={prism}
        className="rounded-md overflow-x-auto max-w-full bg-transparent mt-2"
      >
        {value}
      </SyntaxHighlighter>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 text-black text-xs mt-2 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200 transition-all"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
};

