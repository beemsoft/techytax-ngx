import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { ProjectService } from '@app/shared/services/project.service';

@Component({
  standalone: false, templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    projects = signal<any[] | null>(null);

    constructor(
        private projectService: ProjectService
    ) {}

    ngOnInit() {
        this.projectService.getAll()
            .pipe(first())
            .subscribe(projects => {
                this.projects.set(projects);
            });
    }

    deleteProject(id: string) {
        const project = this.projects().find(x => x.id === id);
        project.isDeleting = true;
        this.projectService.deleteById(id)
            .pipe(first())
            .subscribe(() => {
                this.projects.set(this.projects().filter(x => x.id !== id));
            });
    }
}
