import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ProjectService } from '@app/shared/services/project.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    projects = null;

    constructor(private projectService: ProjectService) {}

    ngOnInit() {
        this.projectService.getAll()
            .pipe(first())
            .subscribe(projects => this.projects = projects);
    }

    deleteProject(id: string) {
        const project = this.projects.find(x => x.id === id);
        project.isDeleting = true;
        this.projectService.deleteById(id)
            .pipe(first())
            .subscribe(() => {
                this.projects = this.projects.filter(x => x.id !== id)
            });
    }
}
