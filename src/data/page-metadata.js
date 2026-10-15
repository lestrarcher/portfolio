export const siteURL = 'https://mickael-kern.vercel.app/';
const home = {
    title: 'Mickael Kern | Développeur Full-Stack à Nîmes',
    description: 'Portfolio de Mickael Kern, développeur full-stack à Nîmes. Découvrez mes projets React, Angular, Symfony et TypeScript.'
};

// Shared by the static build and client navigation; project copy stays in projects.js.
export function getPageMetadata(project, path = '/') {
    const notFound = path !== '/' && !project;
    return {
        title: project ? `${project.title} | Portfolio` : notFound ? 'Page introuvable | Portfolio' : home.title,
        description: project?.description ?? (notFound ? 'Cette page n’existe pas.' : home.description),
        type: 'website',
        url: notFound ? null : new URL(project ? `/projects/${project.id}` : '/', siteURL).href,
        notFound
    };
}
