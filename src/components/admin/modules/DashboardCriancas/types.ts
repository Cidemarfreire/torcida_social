export type ChildStatus = "active" | "pending" | "inactive";

export type ChildHealthProfile = {
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  cid?: string;
  medications?: string;
  medicationSchedule?: string;
  specialCare?: string;
  restrictions?: string;
  healthInsurance?: string;
  doctorContact?: string;
};

export type ChildGuardian = {
  name: string;
  whatsapp: string;
  email?: string;
  relationship?: string;
  emergencyPhone?: string;
};

export type ChildTimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "registration" | "health" | "sport" | "education" | "social" | "note";
};

export type ChildProfile = {
  id: string;
  fullName: string;
  birthDate?: string;
  age: number;
  gender?: string;
  photoUrl?: string;

  nucleus: string;
  school?: string;
  grade?: string;
  category?: string;
  teacher?: string;

  guardian: ChildGuardian;
  health: ChildHealthProfile;

  status: ChildStatus;
  observations?: string;
  createdAt: string;
  updatedAt?: string;

  timeline: ChildTimelineEvent[];
};