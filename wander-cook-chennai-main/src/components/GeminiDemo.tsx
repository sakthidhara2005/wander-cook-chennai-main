import { useState } from "react";
import { genAI } from "../lib/geminiClient";

export default function GeminiDemo() {
  const [response, setResponse] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleClick = async () => {
    if (!image) return;
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(",")[1];
      const result = await model.generateContent([
        { inlineData: { mimeType: image.type, data: base64 } },
        "Detect the ingredients in this image. List them clearly."
      ]);
      setResponse(result.response.text());
      setLoading(false);
    };
    reader.readAsDataURL(image);
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
        disabled={!image || loading}
      >
        {loading ? "Detecting..." : "Detect Ingredients ✨"}
      </button>
      {response && <p className="mt-4 whitespace-pre-line">{response}</p>}
    </div>
  );
}
