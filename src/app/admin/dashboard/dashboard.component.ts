import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SkillsService } from '../../services/skills.service';
import { ExperienceService } from '../../services/experience.service';
import { ProjectsService } from '../../services/projects.service';
import { ProfileService } from '../../services/profile.service';
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
projects: any[] = [];
editingSkillId: string | null = null;
editingProjectId: string | null = null;
editingCompanyId: string | null = null;
editingCompanyProjectId: string | null = null;
menuOpen = false;

personalProject = {
  title: '',
  skills: '',
  description: ''
};


  skill = {
  title: '',
  description: ''
};

profile = {
  heroSubtitle: '',
  heroLine: '',
  aboutHeading: '',
  aboutText: ''
};
  constructor(
    private authService: AuthService,
    private router: Router,
    private skillsService: SkillsService,
    private experienceService: ExperienceService,
    private projectsService: ProjectsService,
   private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadCompanies();
    this.loadProjects();
    this.loadProfile();
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
  editSkill(item: any): void {
  this.editingSkillId = item.id;
  this.skill = {
    title: item.title,
    description: item.description
  };
}

updateSkill(): void {
  if (!this.editingSkillId) return;

  this.skillsService.updateSkill(this.editingSkillId, this.skill).then(() => {
    this.editingSkillId = null;
    this.skill = { title: '', description: '' };
  });
}

cancelSkillEdit(): void {
  this.editingSkillId = null;
  this.skill = { title: '', description: '' };
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
editCompany(item: any): void {
  this.editingCompanyId = item.id;
  this.company = {
    companyName: item.companyName,
    role: item.role,
    location: item.location,
    duration: item.duration
  };
}

updateCompany(): void {
  if (!this.editingCompanyId) return;

  this.experienceService.updateCompany(this.editingCompanyId, this.company).then(() => {
    this.editingCompanyId = null;
    this.company = {
      companyName: '',
      role: '',
      location: '',
      duration: ''
    };
  });
}

cancelCompanyEdit(): void {
  this.editingCompanyId = null;
  this.company = {
    companyName: '',
    role: '',
    location: '',
    duration: ''
  };
}

deleteProject(projectId: string): void {
  if (!this.selectedCompany) {
    return;
  }

  this.experienceService.deleteProject(this.selectedCompany.id, projectId);
}

loadProjects(): void {
  this.projectsService.getProjects().subscribe((data: any) => {
    this.projects = data;
  });
}
editCompanyProject(item: any): void {
  this.editingCompanyProjectId = item.id;
  this.project = {
    title: item.title,
    subtitle: item.subtitle,
    description: item.description
  };
}

updateCompanyProject(): void {
  if (!this.selectedCompany || !this.editingCompanyProjectId) return;

  this.experienceService
    .updateProject(this.selectedCompany.id, this.editingCompanyProjectId, this.project)
    .then(() => {
      this.editingCompanyProjectId = null;
      this.project = {
        title: '',
        subtitle: '',
        description: ''
      };
    });
}

cancelCompanyProjectEdit(): void {
  this.editingCompanyProjectId = null;
  this.project = {
    title: '',
    subtitle: '',
    description: ''
  };
}

addPersonalProject(): void {
  if (
    !this.personalProject.title ||
    !this.personalProject.skills ||
    !this.personalProject.description
  ) {
    return;
  }

  this.projectsService.addProject(this.personalProject).then(() => {
    this.personalProject = {
      title: '',
      skills: '',
      description: ''
    };
  });
}

deletePersonalProject(id: string): void {
  this.projectsService.deleteProject(id);
}
editPersonalProject(item: any): void {
  this.editingProjectId = item.id;
  this.personalProject = {
    title: item.title,
    skills: item.skills,
    description: item.description
  };
}

updatePersonalProject(): void {
  if (!this.editingProjectId) return;

  this.projectsService.updateProject(this.editingProjectId, this.personalProject).then(() => {
    this.editingProjectId = null;
    this.personalProject = { title: '', skills: '', description: '' };
  });
}

cancelProjectEdit(): void {
  this.editingProjectId = null;
  this.personalProject = { title: '', skills: '', description: '' };
}

loadProfile(): void {
  this.profileService.getProfile().subscribe((data: any) => {
    if (data) {
      this.profile = {
        heroSubtitle: data.heroSubtitle || '',
        heroLine: data.heroLine || '',
        aboutHeading: data.aboutHeading || '',
        aboutText: data.aboutText || ''
      };
    }
  });
}

saveProfile(): void {
  this.profileService.updateProfile(this.profile);
}
}