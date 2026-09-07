import { useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Film, LoaderCircle, Upload } from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ApiError, transcribeVideo } from "@/lib/api";

function Captioning() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onFileChange(next: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(next);
    setTranscript("");
    setError(null);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setError(null);
    setTranscript("");

    try {
      const result = await transcribeVideo(file);
      setTranscript(result.transcript || "No speech detected.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Transcription failed.");
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

        <form onSubmit={handleSubmit} className="grid gap-[6px] items-center justify-center lg:grid-cols-2">
          <div className="space-y-[2px] flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-[20px] w-full flex-col items-center justify-center gap-[4px] rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-[6px] py-[20px] text-center transition hover:border-[#c8f542]/50 hover:bg-white/[0.05]"
            >
              <Upload className="size-[60px] text-[#c8f542]" />
              <div>
                <p className="font-medium">
                  {file ? file.name : "Drop or choose a video"}
                </p>
                <p className="mt-1 text-sm text-foreground/45">
                  MP4, WebM, MOV — transcription may take a minute
                </p>
              </div>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />

            {previewUrl && (
              <video
                src={previewUrl}
                controls
                className="max-h-[200px] size-1/2 w-fit rounded-xl border border-white/10 bg-black object-contain"
              />
            )}

            <Button
              type="submit"
              disabled={!file || loading}
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
            <div className="mb-[8px] pl-[5px]  flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-wider text-foreground/50">
                Transcript
              </h2>
              {transcript && (
                <button
                  type="button"
                  className="text-xs text-[#c8f542] hover:underline"
                  onClick={() => navigator.clipboard.writeText(transcript)}
                >
                  Copy
                </button>
              )}
            </div>
            <div className="whitespace-pre-wrap pl-[5px] text-sm leading-relaxed text-foreground/85">
              {loading
                ? "Processing video with Gemini…"
                : transcript || "Your transcript will appear here."}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Captioning;
