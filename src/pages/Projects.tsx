
import { ProjectsOverview } from '../components/projects/ProjectsOverview';
import { MainLayout } from '../components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const Projects = () => {
  const { t } = useLanguage();
  
  return (
    <MainLayout>
      <ProjectsOverview />
    </MainLayout>
  );
};

export default Projects;
