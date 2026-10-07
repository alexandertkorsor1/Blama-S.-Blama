import DocumentDownloadHub from './DocumentDownloadHub';
import SectionHeading from './SectionHeading';

interface ResumeSectionProps {
  onOpenSectionInDossier?: (sectionId: string) => void;
}

export default function ResumeSection({ onOpenSectionInDossier }: ResumeSectionProps) {
  return (
    <section id="resume" className="section-padding py-20 lg:py-28 bg-parchment-100/70">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <SectionHeading
            eyebrow="Official Documentation"
            title="Curriculum Vitae & Document Hub"
            description="Select and export authenticated executive CVs, specialized defense administration reports, or scholarly policy treatises formatted for institutional and academic review."
          />
        </div>

        <div className="reveal mt-12">
          <DocumentDownloadHub
            isOpen={true}
            onOpenSectionInDossier={onOpenSectionInDossier}
          />
        </div>
      </div>
    </section>
  );
}
