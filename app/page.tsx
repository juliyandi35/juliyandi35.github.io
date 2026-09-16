import Hero from "@/components/Hero";
import Trajectory from "@/components/Trajectory";
import EvidenceAtScale from "@/components/EvidenceAtScale";
import SelectedInvestigations from "@/components/SelectedInvestigations";
import ProfessionalTimeline from "@/components/ProfessionalTimeline";
import EducationFormation from "@/components/EducationFormation";
import SkillsBench from "@/components/SkillsBench";
import Contact from "@/components/Contact";
import DepthShell from "@/components/Exploration/DepthShell";
import DepthLayer from "@/components/Exploration/DepthLayer";
import GraphStage from "@/components/Graph/GraphStage";

/**
 * Reads as a recruiter's decision order, not a tour of internal section
 * names: who this is → flagship work → professional experience → skills and
 * education → contact. The exploratory graph is deliberately last — proof
 * available to whoever wants to dig deeper, not the thing standing between
 * a visitor and the parts that actually explain the person. The full catalog
 * ("/atlas") is not a homepage section at all any more: the graph is the one
 * place that shows every project in full, and "/atlas" exists only as what
 * the graph's own links ("list them in the atlas", the no-WebGL fallback)
 * point to for a searchable list / keyboard-and-screen-reader equivalent.
 */
export default function HomePage() {
  return (
    <DepthShell>
      <main id="main-content">
        <DepthLayer>
          <Hero />
        </DepthLayer>
        <DepthLayer>
          <Trajectory />
        </DepthLayer>
        <DepthLayer>
          <SelectedInvestigations />
        </DepthLayer>
        <DepthLayer>
          <ProfessionalTimeline />
        </DepthLayer>
        <DepthLayer>
          <EducationFormation />
        </DepthLayer>
        <DepthLayer>
          <SkillsBench />
        </DepthLayer>
        <DepthLayer>
          <EvidenceAtScale />
        </DepthLayer>
        <DepthLayer>
          <Contact />
        </DepthLayer>

        <GraphStage />
      </main>
    </DepthShell>
  );
}
