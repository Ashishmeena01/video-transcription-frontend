import { useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Film, LoaderCircle, Upload } from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  ApiError,
  getUploadSignature,
  transcribeVideo,
} from "@/lib/api";



function Captioning() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultURL, setResultURL] = useState<any>(null);

  async function startUploading(videoFile: File) {  
    try {
      const res: {
        timestamp: number;
        signature: string;
        folder: string;
        cloudName: string;
        apiKey: string;
      } = await getUploadSignature();

      setUploading(true);

      const formData = new FormData();

      formData.append("file", videoFile);
      formData.append("api_key", res.apiKey);
      formData.append("timestamp", res.timestamp.toString());
      formData.append("signature", res.signature);
      formData.append("folder", res.folder);

      const path = `https://api.cloudinary.com/v1_1/${res.cloudName}/video/upload`;

      console.log("Uploading to Cloudinary:", path);

      const uploadResult = await fetch(path, {
        method: "POST",
        body: formData,
      });

      if (!uploadResult.ok) {
        const data = await uploadResult.json();

        throw new Error(
          data?.error?.message || "Cloudinary upload failed."
        );
      }

      const rst = await uploadResult.json();
      ///send the result to the backend to store the video URL and other metadata
      setResultURL(rst);
      console.log("Cloudinary upload successful:", rst);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Video upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(next: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(next);
    setTranscript("");
    setError(null);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);

    if (next) {
      startUploading(next);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file || loading || uploading) return;

    setLoading(true);
    setError(null);
    setTranscript("");

    try {
      if(!resultURL.secure_url){
        throw new Error("Video upload failed. Please try again.");
      }
      const result1 = await transcribeVideo(resultURL.secure_url);

      setTranscript(
        result1.transcript || "No speech detected."
      );
      
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Transcription failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,245,66,0.08),transparent_50%)]" />

      <Navbar />

      <main className="relative z-10 mx-auto w-11/12 max-w-5xl py-[30px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-[40px] space-y-[4px]"
        >
          <h1 className="font-(family-name:--font-display) text-3xl tracking-tight sm:text-4xl">
            Caption your video
          </h1>

          <p className="max-w-xl text-foreground/55">
            Upload a video and get your video's transcription.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="grid items-center justify-center gap-[6px] lg:grid-cols-2"
        >
          <div className="flex flex-col items-center justify-center space-y-[2px]">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex min-h-[20px] w-full flex-col items-center justify-center gap-[4px] rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-[6px] py-[20px] text-center transition hover:border-[#c8f542]/50 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="size-[60px] text-[#c8f542]" />

              <div>
                <p className="font-medium">
                  {file
                    ? file.name
                    : "Drop or choose a video"}
                </p>

                <p className="mt-1 text-sm text-foreground/45">
                  MP4, WebM, MOV — transcription may take a
                  minute
                </p>
              </div>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) =>
                onFileChange(
                  e.target.files?.[0] ?? null
                )
              }
            />

            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="max-h-[200px] size-1/2 w-fit rounded-xl border border-white/10 bg-black object-contain"
              />
            )}

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-foreground/50">
                <LoaderCircle className="size-4 animate-spin" />
                Uploading video…
              </div>
            )}

            <Button
              type="submit"
              disabled={!file || loading || uploading}
              className="h-10 w-full bg-[#c8f542] text-black hover:bg-[#d4f76a] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Transcribing…
                </>
              ) : (
                <>
                  <Film />
                  Generate transcript
                </>
              )}
            </Button>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          <div className="min-h-[200px] rounded-2xl border border-[white]/10 bg-[white]/3 p-[5px]">
            <div className="mb-[8px] flex items-center justify-between pl-[5px]">
              <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50">
                Transcript
              </h2>

              {transcript && (
                <button
                  type="button"
                  className="text-xs text-[#c8f542] hover:underline"
                  onClick={() =>
                    navigator.clipboard.writeText(transcript)
                  }
                >
                  Copy
                </button>
              )}
            </div>

            <div className="w-[350px] whitespace-pre-wrap text-wrap pl-[5px] text-sm leading-relaxed text-foreground/85">
              {loading
                ? "Processing video with our ai please wait while we are processing…"
                : transcript ||
                "Your transcript will appear here."}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Captioning;