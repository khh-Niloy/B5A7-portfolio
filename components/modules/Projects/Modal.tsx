import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getEachProject from "@/helper/getEachProject";

export async function Modal({ id }: { id: string }) {


  const project = await getEachProject(id);
  console.log(project);

  // Normalize helper for arrays/strings
  const toArray = (val: any) => {
    if (!val) return [] as string[];
    if (Array.isArray(val)) return val as string[];
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [] as string[];
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button size="sm" className="cursor-pointer" variant="outline">
            Project Details
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:w-[90%] max-h-[70vh] overflow-y-auto w-full">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {project?.projectName || "Project Details"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {project?.tagline && (
              <span className="inline-block px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm">
                {project.tagline}
              </span>
            )}

            {project?.shortDes && (
              <div>
                <h4 className="text-white font-semibold mb-1">Summary</h4>
                <p className="text-gray-300 leading-relaxed">{project.shortDes}</p>
              </div>
            )}

            {project?.problemSolution && (
              <div>
                <h4 className="text-white font-semibold mb-1">Problem & Solution</h4>
                <p className="text-gray-300 leading-relaxed">{project.problemSolution}</p>
              </div>
            )}

            {toArray(project?.techStack).length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {toArray(project?.techStack).map((t, i) => (
                    <span
                      key={`tech-${i}`}
                      className="px-3 py-1.5 bg-white/10 text-gray-300 text-sm rounded-lg border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {toArray(project?.features).length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Key Features</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {toArray(project?.features).map((f, i) => (
                    <li key={`feat-${i}`}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {project?.dependencies && (
              <div>
                <h4 className="text-white font-semibold mb-1">Dependencies</h4>
                <p className="text-gray-300 leading-relaxed">{project.dependencies}</p>
              </div>
            )}

            {project?.responsibilities && (
              <div>
                <h4 className="text-white font-semibold mb-1">Responsibilities</h4>
                <p className="text-gray-300 leading-relaxed">{project.responsibilities}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {project?.liveSite && (
                <a
                  href={project.liveSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  Live Site
                </a>
              )}
              {project?.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button className="cursor-pointer w-full" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
