export const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getDaysDifference = (eventDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(eventDateStr + "T00:00:00");
  return Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
};

export const CATEGORIES = ["Todos", "Palestras", "Workshops", "Hackathons", "Seminários"];
export const COURSES = ["Todos", "Engenharia de Software", "Engenharia Civil", "Ciência da Computação", "Design", "Geral"];

export const MOCK_USER = {
  name: "Mariana Silva",
  course: "Engenharia de Software",
  semester: "6º Semestre",
  totalHoursNeeded: 120,
  hoursCompleted: 85,
  avatar: "https://i.pravatar.cc/150?img=5",
  notifications: 3,
  role: 'aluno'
};

export const MOCK_PROF = {
  name: "Prof. Roberto Costa",
  department: "Coordenação de TI",
  avatar: "https://i.pravatar.cc/150?img=11",
  role: 'professor'
};

export const INITIAL_EVENTS = [
  {
    id: 1,
    title: "O Futuro da IA na Engenharia",
    category: "Palestras",
    date: getRelativeDate(1),
    time: "14:00 - 16:00",
    location: "Auditório Principal, Bloco A",
    hours: 2,
    spots: 50,
    enrolled: 45,
    speaker: "Dr. Roberto Costa",
    description: "Uma visão aprofundada sobre como a Inteligência Artificial está remodelando os processos.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isEnrolled: false,
    courses: ["Engenharia de Software", "Engenharia Civil"]
  },
  {
    id: 2,
    title: "Workshop: React Avançado",
    category: "Workshops",
    date: getRelativeDate(5),
    time: "09:00 - 12:00",
    location: "Laboratório 3, Bloco C",
    hours: 3,
    spots: 30,
    enrolled: 30,
    speaker: "Profa. Ana Lima",
    description: "Aprenda padrões avançados do React, otimização de performance e gerenciamento de estado.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isEnrolled: true,
    courses: ["Engenharia de Software", "Ciência da Computação"]
  }
];



export const INITIAL_SUGGESTIONS = [
  { id: 201, student: "Mariana Silva", avatar: "https://i.pravatar.cc/150?img=5", course: "Engenharia de Software", title: "Workshop de Figma Avançado", description: "Muitos alunos têm dificuldade em prototipar. Um workshop focado nisso ajudaria muito.", date: getRelativeDate(0), status: 'pendente' },
];
