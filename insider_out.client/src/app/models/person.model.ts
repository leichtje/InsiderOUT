export interface PersonModel {
  firstName: string;
  lastName: string;
  email?: string;
}

export interface UserModel extends PersonModel {
    userId: number;

}

export interface SubjectModel extends PersonModel {
    subjectId: number;
    department?: string;
}
