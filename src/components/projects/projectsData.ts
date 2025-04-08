
import { Project } from './types';

export const projectsData: Project[] = [
  {
    id: 1,
    name: "تطوير واجهة المستخدم",
    project_number: "1000",
    client: "شركة تقنية المعلومات",
    status: "in_progress",
    progress: 65,
    deadline: "2023-05-28",
    team: 4,
    priority: "High",
    tag: "UI/UX"
  },
  {
    id: 2,
    name: "إعادة تصميم الموقع الإلكتروني",
    project_number: "1001",
    client: "مؤسسة الأبحاث العلمية",
    status: "completed",
    progress: 100,
    deadline: "2023-04-15",
    team: 3,
    priority: "Medium",
    tag: "Web Design"
  },
  {
    id: 3,
    name: "تطوير تطبيق الهاتف المحمول",
    project_number: "1002",
    client: "شركة الاتصالات السعودية",
    status: "not_started",
    progress: 0,
    deadline: "2023-06-30",
    team: 5,
    priority: "Urgent",
    tag: "Mobile App"
  },
  {
    id: 4,
    name: "تحسين أداء النظام",
    project_number: "1003",
    client: "وزارة التعليم",
    status: "at_risk",
    progress: 30,
    deadline: "2023-05-10",
    team: 2,
    priority: "High",
    tag: "Performance"
  },
  {
    id: 5,
    name: "تحليل البيانات",
    project_number: "1004",
    client: "شركة البيانات الضخمة",
    status: "in_review",
    progress: 85,
    deadline: "2023-05-22",
    team: 3,
    priority: "Medium",
    tag: "Analytics"
  },
  {
    id: 6,
    name: "تطوير واجهة برمجة التطبيقات",
    project_number: "1005",
    client: "منصة التجارة الإلكترونية",
    status: "in_progress",
    progress: 45,
    deadline: "2023-06-15",
    team: 4,
    priority: "High",
    tag: "API"
  }
];
