import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SkillsService } from '../../services/skills.service';
import { ExperienceService } from '../../services/experience.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  activeTab = 'skills';

  skills: any[] = [];
  companies: any[] = [];
selectedCompany: any = null;
companyProjects: any[] = [];


  skill = {
  title: '',
  description: ''
};

  constructor(
    private authService: AuthService,
    private router: Router,
    private skillsService: SkillsService,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadCompanies();
  }

  loadSkills(): void {
    this.skillsService.getSkills().subscribe((data: any) => {
      this.skills = data;
    });
  }

  addSkill(): void {

    if (
      !this.skill.title ||
      !this.skill.description
    ) {
      return;
    }

    this.skillsService.addSkill(this.skill).then(() => {

      this.skill = {
        title: '',
        description: ''
      };

    });
  }
  company = {
  companyName: '',
  role: '',
  location: '',
  duration: ''
};

project = {
  title: '',
  subtitle: '',
  description: ''
};






  deleteSkill(id: string): void {
    this.skillsService.deleteSkill(id);
  }

  logout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/admin/login']);
    });
  }


  loadCompanies(): void {
  this.experienceService.getCompanies().subscribe((data: any) => {
    this.companies = data;
  });
}

addCompany(): void {
  if (
    !this.company.companyName ||
    !this.company.role ||
    !this.company.duration
  ) {
    return;
  }

  this.experienceService.addCompany(this.company).then(() => {
    this.company = {
      companyName: '',
      role: '',
      location: '',
      duration: ''
    };
  });
}

selectCompany(company: any): void {
  this.selectedCompany = company;

  this.experienceService.getProjects(company.id).subscribe((data: any) => {
    this.companyProjects = data;
  });
}

addProject(): void {
  if (!this.selectedCompany) {
    return;
  }

  if (!this.project.title || !this.project.description) {
    return;
  }

  this.experienceService.addProject(this.selectedCompany.id, this.project).then(() => {
    this.project = {
      title: '',
      subtitle: '',
      description: ''
    };
  });
}

deleteCompany(companyId: string): void {
  this.experienceService.deleteCompany(companyId);
}

deleteProject(projectId: string): void {
  if (!this.selectedCompany) {
    return;
  }

  this.experienceService.deleteProject(this.selectedCompany.id, projectId);
}
}