import React from 'react';
import Project from '@/types/TaskInstance';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <>
            <div className={`card ${styles['project-card']}`}>
                <div className='card-body'>
                    <h6>Project {project.project_title}</h6>
                </div>
            </div>
        </>
    );
};

export default ProjectCard;
